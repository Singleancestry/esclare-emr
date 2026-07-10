import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function ServicesPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "services.view");

  return (
    <ProtectedPlaceholder
      title="Treatments and Services"
      description="Phase 3 will add catalog, price versioning, packages, branch availability and Google Sheets staging."
    />
  );
}
