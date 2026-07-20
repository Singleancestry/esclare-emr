import "server-only";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import type { StaffContext } from "@/lib/permissions/types";
import { hasPermission } from "@/lib/permissions/checks";
import type { AppointmentRequestStatus } from "@/lib/validation/appointment-request";
import type {
  AppointmentRequestInbox,
  AppointmentRequestRecord,
  AppointmentWorkspace,
} from "./types";

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

export async function getAppointmentRequestInbox(
  staff: StaffContext,
): Promise<AppointmentRequestInbox> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { requests: [], persistenceConfigured: false };
  }

  const branchIds = staff.branches
    .filter((branch) => hasPermission(staff, "appointments.view", branch.id))
    .map((branch) => branch.id);
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
    throw new Error("Appointment requests are temporarily unavailable.");
  }

  const requests = (data as unknown as AppointmentRequestRow[]).map<AppointmentRequestRecord>(
    (row) => ({
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
    }),
  );

  return { requests, persistenceConfigured: true };
}

export async function getAppointmentWorkspace(staff: StaffContext): Promise<AppointmentWorkspace> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      appointments: [],
      patients: [],
      services: [],
      providers: [],
      rooms: [],
      persistenceConfigured: false,
    };
  }

  const branchIds = staff.branches
    .filter((branch) => hasPermission(staff, "appointments.view", branch.id))
    .map((branch) => branch.id);
  if (branchIds.length === 0) {
    return {
      appointments: [],
      patients: [],
      services: [],
      providers: [],
      rooms: [],
      persistenceConfigured: true,
    };
  }
  const [appointmentResult, patientResult, serviceResult, providerResult, roomResult] =
    await Promise.all([
      supabase
        .from("appointments")
        .select(
          "id, branch_id, starts_at, ends_at, status, booking_note, patients(first_name,last_name), services(name), employees:provider_employee_id(display_name), rooms(name)",
        )
        .in("branch_id", branchIds)
        .is("archived_at", null)
        .order("starts_at")
        .limit(250),
      supabase
        .from("patients")
        .select("id, first_name, last_name, home_branch_id")
        .in("home_branch_id", branchIds)
        .is("archived_at", null)
        .order("last_name")
        .limit(500),
      supabase.from("services").select("id, name").is("archived_at", null).order("name"),
      supabase
        .from("employee_branch_roles")
        .select("branch_id, employees(id,display_name,status)")
        .in("branch_id", branchIds)
        .is("ends_at", null),
      supabase
        .from("rooms")
        .select("id, name, branch_id")
        .in("branch_id", branchIds)
        .eq("active", true)
        .order("name"),
    ]);

  if (
    appointmentResult.error ||
    patientResult.error ||
    serviceResult.error ||
    providerResult.error ||
    roomResult.error
  ) {
    throw new Error("Appointment workspace is temporarily unavailable.");
  }

  const rows = (appointmentResult.data ?? []) as unknown as Array<Record<string, unknown>>;
  const providers = new Map<string, { id: string; label: string; branchId: string }>();
  for (const assignment of (providerResult.data ?? []) as unknown as Array<
    Record<string, unknown>
  >) {
    const employee = assignment.employees as {
      id: string;
      display_name: string;
      status: string;
    } | null;
    if (employee?.status === "active")
      providers.set(`${employee.id}:${assignment.branch_id}`, {
        id: employee.id,
        label: employee.display_name,
        branchId: String(assignment.branch_id),
      });
  }

  return {
    appointments: rows.map((row) => ({
      id: String(row.id),
      branchId: String(row.branch_id),
      startsAt: String(row.starts_at),
      endsAt: String(row.ends_at),
      status: row.status as AppointmentWorkspace["appointments"][number]["status"],
      bookingNote: row.booking_note ? String(row.booking_note) : null,
      patientName:
        `${(row.patients as { first_name: string; last_name: string } | null)?.first_name ?? ""} ${(row.patients as { first_name: string; last_name: string } | null)?.last_name ?? ""}`.trim() ||
        "Patient",
      serviceName: (row.services as { name: string } | null)?.name ?? "General appointment",
      providerName: (row.employees as { display_name: string } | null)?.display_name ?? null,
      roomName: (row.rooms as { name: string } | null)?.name ?? null,
    })),
    patients: (
      (patientResult.data ?? []) as Array<{
        id: string;
        first_name: string;
        last_name: string;
        home_branch_id: string;
      }>
    ).map((row) => ({
      id: row.id,
      label: `${row.last_name}, ${row.first_name}`,
      branchId: row.home_branch_id,
    })),
    services: ((serviceResult.data ?? []) as Array<{ id: string; name: string }>).map((row) => ({
      id: row.id,
      label: row.name,
    })),
    providers: [...providers.values()],
    rooms: ((roomResult.data ?? []) as Array<{ id: string; name: string; branch_id: string }>).map(
      (row) => ({ id: row.id, label: row.name, branchId: row.branch_id }),
    ),
    persistenceConfigured: true,
  };
}
