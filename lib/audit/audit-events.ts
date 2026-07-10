import "server-only";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";

type AuditEventInput = {
  actorEmployeeId: string;
  actorRole: string;
  branchId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  patientId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string;
  success: boolean;
};

export async function recordAuditEvent(event: AuditEventInput) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return;
  }

  await admin.from("audit_events").insert({
    actor_employee_id: event.actorEmployeeId,
    actor_role: event.actorRole,
    branch_id: event.branchId,
    action: event.action,
    entity_type: event.entityType,
    entity_id: event.entityId,
    patient_id: event.patientId,
    previous_value: event.previousValue,
    new_value: event.newValue,
    reason: event.reason,
    success: event.success,
  });
}
