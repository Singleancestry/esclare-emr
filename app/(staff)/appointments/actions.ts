"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { isFeatureEnabled } from "@/lib/features/flags";
import { hasBranchAccess, hasPermission } from "@/lib/permissions/checks";
import {
  appointmentRequestStatusUpdateSchema,
  canTransitionAppointmentRequest,
  type AppointmentRequestStatus,
} from "@/lib/validation/appointment-request";
import {
  appointmentCreateSchema,
  appointmentTransitionSchema,
  canTransitionAppointment,
  type AppointmentStatus,
} from "@/lib/validation/appointment";

export type AppointmentRequestUpdateState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export type AppointmentActionState = AppointmentRequestUpdateState;

export async function createAppointmentAction(
  _previousState: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const staff = await getCurrentStaffContext();
  if (!staff) return { status: "error", message: "Staff session is required." };
  if (!isFeatureEnabled("appointments", staff.employee.id)) {
    return { status: "error", message: "Appointment scheduling is not enabled." };
  }
  const parsed = appointmentCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the appointment details.",
    };
  if (
    !hasBranchAccess(staff, parsed.data.branchId) ||
    !hasPermission(staff, "appointments.create", parsed.data.branchId)
  )
    return { status: "error", message: "You do not have access to this branch." };
  const admin = createSupabaseAdminClient();
  if (!admin)
    return { status: "error", message: "Configure Supabase before scheduling appointments." };

  const { data: patient } = await admin
    .from("patients")
    .select("id, home_branch_id")
    .eq("id", parsed.data.patientId)
    .is("archived_at", null)
    .maybeSingle();
  if (!patient || !hasBranchAccess(staff, patient.home_branch_id))
    return { status: "error", message: "Patient is not available to this staff member." };

  if (parsed.data.providerEmployeeId) {
    const { data: assignment } = await admin
      .from("employee_branch_roles")
      .select("id")
      .eq("employee_id", parsed.data.providerEmployeeId)
      .eq("branch_id", parsed.data.branchId)
      .is("ends_at", null)
      .limit(1)
      .maybeSingle();
    if (!assignment)
      return { status: "error", message: "Provider is not assigned to the selected branch." };
  }
  if (parsed.data.roomId) {
    const { data: room } = await admin
      .from("rooms")
      .select("id")
      .eq("id", parsed.data.roomId)
      .eq("branch_id", parsed.data.branchId)
      .eq("active", true)
      .maybeSingle();
    if (!room) return { status: "error", message: "Room is not available at the selected branch." };
  }

  const { error } = await admin.rpc("create_appointment_atomic", {
    p_branch_id: parsed.data.branchId,
    p_patient_id: parsed.data.patientId,
    p_service_id: parsed.data.serviceId,
    p_provider_employee_id: parsed.data.providerEmployeeId,
    p_room_id: parsed.data.roomId,
    p_starts_at: new Date(parsed.data.startsAt).toISOString(),
    p_ends_at: new Date(parsed.data.endsAt).toISOString(),
    p_booking_note: parsed.data.bookingNote,
    p_actor_employee_id: staff.employee.id,
  });
  if (error)
    return {
      status: "error",
      message:
        error.code === "23P01"
          ? "That provider or room is already booked for this time."
          : "The appointment could not be scheduled.",
    };

  revalidatePath("/appointments");
  return { status: "success", message: "Appointment scheduled." };
}

const transitionPermission = {
  confirmed: "appointments.confirm",
  checked_in: "appointments.check_in",
  in_progress: "appointments.start_treatment",
  completed: "appointments.complete",
  cancelled: "appointments.cancel",
  no_show: "appointments.cancel",
  scheduled: "appointments.create",
} as const;

export async function transitionAppointmentAction(
  _previousState: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const staff = await getCurrentStaffContext();
  if (staff && !isFeatureEnabled("appointments", staff.employee.id)) {
    return { status: "error", message: "Appointment scheduling is not enabled." };
  }
  const parsed = appointmentTransitionSchema.safeParse(Object.fromEntries(formData));
  if (!staff || !parsed.success)
    return {
      status: "error",
      message: parsed.success
        ? "Staff session is required."
        : (parsed.error.issues[0]?.message ?? "Check the status update."),
    };
  const admin = createSupabaseAdminClient();
  if (!admin)
    return { status: "error", message: "Configure Supabase before updating appointments." };
  const { data: current } = await admin
    .from("appointments")
    .select("id, branch_id, patient_id, status")
    .eq("id", parsed.data.appointmentId)
    .is("archived_at", null)
    .maybeSingle();
  if (!current || !hasBranchAccess(staff, current.branch_id))
    return { status: "error", message: "Appointment was not found for your branch." };
  const permission = transitionPermission[parsed.data.status];
  if (!hasPermission(staff, permission, current.branch_id))
    return { status: "error", message: "You do not have permission for this appointment action." };
  const fromStatus = current.status as AppointmentStatus;
  if (!canTransitionAppointment(fromStatus, parsed.data.status))
    return {
      status: "error",
      message: `A ${fromStatus.replaceAll("_", " ")} appointment cannot move to ${parsed.data.status.replaceAll("_", " ")}.`,
    };
  const { error } = await admin.rpc("transition_appointment_atomic", {
    p_appointment_id: current.id,
    p_expected_status: fromStatus,
    p_new_status: parsed.data.status,
    p_reason: parsed.data.reason,
    p_actor_employee_id: staff.employee.id,
  });
  if (error) {
    return {
      status: "error",
      message:
        error.code === "40001"
          ? "This appointment changed while you were working. Refresh before trying again."
          : "The appointment status, history, and audit record could not be saved.",
    };
  }
  revalidatePath("/appointments");
  return {
    status: "success",
    message: `Appointment marked ${parsed.data.status.replaceAll("_", " ")}.`,
  };
}

export async function updateAppointmentRequestStatusAction(
  _previousState: AppointmentRequestUpdateState,
  formData: FormData,
): Promise<AppointmentRequestUpdateState> {
  const staff = await getCurrentStaffContext();
  if (!staff) {
    return {
      status: "error",
      message: "You do not have permission to update appointment requests.",
    };
  }
  if (!isFeatureEnabled("appointments", staff.employee.id)) {
    return { status: "error", message: "Appointment scheduling is not enabled." };
  }

  const parsed = appointmentRequestStatusUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the status update.",
    };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { status: "error", message: "Configure Supabase before updating appointment requests." };
  }

  const { data: current, error: readError } = await admin
    .from("appointment_requests")
    .select("id, branch_id, status")
    .eq("id", parsed.data.requestId)
    .is("archived_at", null)
    .maybeSingle();

  if (readError || !current) {
    return { status: "error", message: "Appointment request was not found." };
  }

  if (!hasBranchAccess(staff, current.branch_id)) {
    return { status: "error", message: "You do not have access to this request's branch." };
  }
  if (!hasPermission(staff, "appointments.confirm", current.branch_id)) {
    return { status: "error", message: "You do not have permission to update this request." };
  }

  const currentStatus = current.status as AppointmentRequestStatus;
  if (!canTransitionAppointmentRequest(currentStatus, parsed.data.status)) {
    return {
      status: "error",
      message: `A ${currentStatus} request cannot move to ${parsed.data.status}.`,
    };
  }

  const { error: updateError } = await admin.rpc("transition_appointment_request_atomic", {
    p_request_id: current.id,
    p_expected_status: currentStatus,
    p_new_status: parsed.data.status,
    p_reason: parsed.data.reason,
    p_actor_employee_id: staff.employee.id,
  });

  if (updateError) {
    return {
      status: "error",
      message:
        updateError.code === "40001"
          ? "This request changed while you were working. Refresh before trying again."
          : "The request status and audit record could not be saved.",
    };
  }

  revalidatePath("/appointments");
  return { status: "success", message: `Request marked ${parsed.data.status}.` };
}
