import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function IntegrationsPage() {
  requireFeature("integrations");
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "prices.view");

  return (
    <ProtectedPlaceholder
      title="Integrations"
      description="Operational calendar, payment, backup and website-booking integrations begin from this protected shell after privacy and access reviews."
    />
  );
}
