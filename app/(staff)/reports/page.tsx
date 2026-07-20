import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function ReportsPage() {
  requireFeature("reports");
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "reports.view_branch");

  return (
    <ProtectedPlaceholder
      title="Reports"
      description="Sales, appointments, treatments, package liability, retention, inventory, staff and branch-comparison reports are reserved for reporting phases."
    />
  );
}
