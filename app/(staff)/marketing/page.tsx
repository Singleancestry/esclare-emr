import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function MarketingPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "patients.view_basic");

  return (
    <ProtectedPlaceholder
      title="CRM and Marketing"
      description="Later phases will add leads, follow-ups, referrals, loyalty, campaigns, promo codes and communication consent."
    />
  );
}
