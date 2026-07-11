import "server-only";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import type { StaffContext } from "@/lib/permissions/types";
import type { AppointmentRequestStatus } from "@/lib/validation/appointment-request";
import type { AppointmentRequestInbox, AppointmentRequestRecord } from "./types";

type AppointmentRequestRow = {
  id: string;
  public_reference: string;
  branch_id: string;
  full_name: string;
  requested_service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: AppointmentRequestStatus;
  status_reason: string | null;
  submitted_at: string;
  handled_at: string | null;
  branches: { name: string } | null;
};

export async function getAppointmentRequestInbox(staff: StaffContext): Promise<AppointmentRequestInbox> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { requests: [], persistenceConfigured: false };
  }

  const branchIds = staff.branches.map((branch) => branch.id);
  const { data, error } = await supabase
    .from("appointment_requests")
    .select(
      "id, public_reference, branch_id, full_name, requested_service, preferred_date, preferred_time, status, status_reason, submitted_at, handled_at, branches:branch_id(name)",
    )
    .in("branch_id", branchIds)
    .is("archived_at", null)
    .order("submitted_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return { requests: [], persistenceConfigured: true };
  }

  const requests = (data as unknown as AppointmentRequestRow[]).map<AppointmentRequestRecord>((row) => ({
    id: row.id,
    reference: row.public_reference,
    branchId: row.branch_id,
    branchName: row.branches?.name ?? "Assigned branch",
    fullName: row.full_name,
    treatmentName: row.requested_service,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    status: row.status,
    statusReason: row.status_reason,
    submittedAt: row.submitted_at,
    handledAt: row.handled_at,
  }));

  return { requests, persistenceConfigured: true };
}
