import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function ClinicalPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "medical.view_summary");

  return (
    <ProtectedPlaceholder
      title="Clinical Records"
      description="Clinical encounters, treatment templates, body map, consent, clinical photos and signing are intentionally reserved for Phase 5."
    />
  );
}
