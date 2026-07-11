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

export type AppointmentRequestUpdateState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export async function updateAppointmentRequestStatusAction(
  _previousState: AppointmentRequestUpdateState,
  formData: FormData,
): Promise<AppointmentRequestUpdateState> {
  const staff = await getCurrentStaffContext();
  if (!staff || !hasPermission(staff, "appointments.confirm")) {
    return { status: "error", message: "You do not have permission to update appointment requests." };
  }

  const parsed = appointmentRequestStatusUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the status update." };
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
    return { status: "error", message: `A ${currentStatus} request cannot move to ${parsed.data.status}.` };
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
  const { error: updateError } = await admin.from("appointment_requests").update(update).eq("id", current.id);

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
