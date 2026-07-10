import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function IntegrationsPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "prices.view");

  return (
    <ProtectedPlaceholder
      title="Integrations"
      description="Google Sheets, Google Calendar, email, SMS, payment gateway, Facebook leads and website booking integrations begin from this protected shell."
    />
  );
}
