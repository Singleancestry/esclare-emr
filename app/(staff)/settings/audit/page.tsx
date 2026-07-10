import { AuditLogTable } from "@/components/security/audit-log-table";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { getPatientAudit } from "@/lib/patients/data";
import { requirePermission } from "@/lib/permissions/checks";

export default async function AuditLogsPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "security.view_audit");
  const events = await getPatientAudit();

  return (
    <main className="grid gap-5 p-4 sm:p-6">
      <div>
        <p className="text-sm font-semibold uppercase text-[#6F263D]">Security</p>
        <h1 className="text-3xl font-semibold text-[#481827]">Audit Logs</h1>
        <p className="mt-2 text-sm text-[#5F6368]">
          Immutable audit events include patient views, contact reveals, record changes and access events.
        </p>
      </div>
      <AuditLogTable events={events} />
    </main>
  );
}
