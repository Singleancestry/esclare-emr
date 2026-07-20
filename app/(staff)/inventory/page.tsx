import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function InventoryPage() {
  requireFeature("inventory");
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "inventory.view");

  return (
    <ProtectedPlaceholder
      title="Inventory"
      description="Phase 7 will add products, suppliers, batches, stock movements, transfers, waste and treatment consumption."
    />
  );
}
