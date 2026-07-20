import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function ArchivedPatientsPage() {
  requireFeature("patientArchive");
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "patients.archive");

  return (
    <ProtectedPlaceholder
      title="Archived Patients"
      description="Archived patient records remain recoverable and auditable. Phase 2 establishes the route and archive permission boundary; archive workflows are implemented without permanent deletion."
    />
  );
}
