import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function PackagesPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "packages.view");

  return (
    <ProtectedPlaceholder
      title="Packages and Sessions"
      description="Phase 6 will add ledger-based package balances, session usage, adjustments and transfer workflows."
    />
  );
}
