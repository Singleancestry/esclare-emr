import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function PosPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "payments.view");

  return (
    <ProtectedPlaceholder
      title="Point of Sale"
      description="Phase 6 will add POS sessions, invoices, payments, receipts, refunds, voids and approvals."
    />
  );
}
