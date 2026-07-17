"use server";

import { revalidatePath } from "next/cache";
import { recordAuditEvent } from "@/lib/audit/audit-events";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getCurrentStaffContext } from "@/lib/auth/session";
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
  if (!staff || !hasPermission(staff, "appointments.create"))
    return { status: "error", message: "You do not have permission to schedule appointments." };
  const parsed = appointmentCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the appointment details.",
    };
  if (!hasBranchAccess(staff, parsed.data.branchId))
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

  const { data: appointment, error } = await admin
    .from("appointments")
    .insert({
      branch_id: parsed.data.branchId,
      patient_id: parsed.data.patientId,
      service_id: parsed.data.serviceId,
      provider_employee_id: parsed.data.providerEmployeeId,
      room_id: parsed.data.roomId,
      starts_at: new Date(parsed.data.startsAt).toISOString(),
      ends_at: new Date(parsed.data.endsAt).toISOString(),
      booking_note: parsed.data.bookingNote || null,
      status: "scheduled",
      created_by: staff.employee.id,
    })
    .select("id")
    .single();
  if (error)
    return {
      status: "error",
      message:
        error.code === "23P01"
          ? "That provider or room is already booked for this time."
          : "The appointment could not be scheduled.",
    };

  await admin.from("appointment_events").insert({
    appointment_id: appointment.id,
    branch_id: parsed.data.branchId,
    to_status: "scheduled",
    reason: "Appointment created",
    actor_employee_id: staff.employee.id,
  });
  await recordAuditEvent({
    actorEmployeeId: staff.employee.id,
    actorRole: staff.activeRole.key,
    branchId: parsed.data.branchId,
    patientId: parsed.data.patientId,
    action: "appointment.create",
    entityType: "appointments",
    entityId: appointment.id,
    newValue: { status: "scheduled", startsAt: parsed.data.startsAt, endsAt: parsed.data.endsAt },
    reason: "Scheduled by staff",
    success: true,
  });
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
  const parsed = appointmentTransitionSchema.safeParse(Object.fromEntries(formData));
  if (!staff || !parsed.success)
    return {
      status: "error",
      message: parsed.success
        ? "Staff session is required."
        : (parsed.error.issues[0]?.message ?? "Check the status update."),
    };
  const permission = transitionPermission[parsed.data.status];
  if (!hasPermission(staff, permission))
    return { status: "error", message: "You do not have permission for this appointment action." };
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
  const fromStatus = current.status as AppointmentStatus;
  if (!canTransitionAppointment(fromStatus, parsed.data.status))
    return {
      status: "error",
      message: `A ${fromStatus.replaceAll("_", " ")} appointment cannot move to ${parsed.data.status.replaceAll("_", " ")}.`,
    };
  const now = new Date().toISOString();
  const timestamps =
    parsed.data.status === "checked_in"
      ? { checked_in_at: now }
      : parsed.data.status === "in_progress"
        ? { started_at: now }
        : parsed.data.status === "completed"
          ? { completed_at: now }
          : ["cancelled", "no_show"].includes(parsed.data.status)
            ? {
                cancelled_at: now,
                cancelled_by: staff.employee.id,
                cancellation_reason: parsed.data.reason,
              }
            : {};
  const { error } = await admin
    .from("appointments")
    .update({ status: parsed.data.status, ...timestamps })
    .eq("id", current.id)
    .eq("status", fromStatus);
  if (error) return { status: "error", message: "The appointment status could not be updated." };
  await admin.from("appointment_events").insert({
    appointment_id: current.id,
    branch_id: current.branch_id,
    from_status: fromStatus,
    to_status: parsed.data.status,
    reason: parsed.data.reason || null,
    actor_employee_id: staff.employee.id,
  });
  await recordAuditEvent({
    actorEmployeeId: staff.employee.id,
    actorRole: staff.activeRole.key,
    branchId: current.branch_id,
    patientId: current.patient_id,
    action: "appointment.status_update",
    entityType: "appointments",
    entityId: current.id,
    previousValue: { status: fromStatus },
    newValue: { status: parsed.data.status },
    reason: parsed.data.reason || "Operational transition",
    success: true,
  });
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
  if (!staff || !hasPermission(staff, "appointments.confirm")) {
    return {
      status: "error",
      message: "You do not have permission to update appointment requests.",
    };
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

  const currentStatus = current.status as AppointmentRequestStatus;
  if (!canTransitionAppointmentRequest(currentStatus, parsed.data.status)) {
    return {
      status: "error",
      message: `A ${currentStatus} request cannot move to ${parsed.data.status}.`,
    };
  }

  const now = new Date().toISOString();
  const update = {
    status: parsed.data.status,
    status_reason: parsed.data.reason,
    handled_by: staff.employee.id,
    handled_at: now,
    archived_at: parsed.data.status === "archived" ? now : null,
    archived_by: parsed.data.status === "archived" ? staff.employee.id : null,
    archive_reason: parsed.data.status === "archived" ? parsed.data.reason : null,
  };
  const { error: updateError } = await admin
    .from("appointment_requests")
    .update(update)
    .eq("id", current.id);

  if (updateError) {
    return { status: "error", message: updateError.message };
  }

  await recordAuditEvent({
    actorEmployeeId: staff.employee.id,
    actorRole: staff.activeRole.key,
    branchId: current.branch_id,
    action: "appointment_request.status_update",
    entityType: "appointment_requests",
    entityId: current.id,
    previousValue: { status: currentStatus },
    newValue: { status: parsed.data.status },
    reason: parsed.data.reason,
    success: true,
  });

  revalidatePath("/appointments");
  return { status: "success", message: `Request marked ${parsed.data.status}.` };
}
