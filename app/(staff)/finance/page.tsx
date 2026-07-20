import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function FinancePage() {
  requireFeature("reports");
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "reports.view_branch");

  return (
    <ProtectedPlaceholder
      title="Finance"
      description="Phase 7 will add daily sales, commissions, refunds, void logs and management reports."
    />
  );
}
