import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function AppointmentsPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "appointments.view");

  return (
    <ProtectedPlaceholder
      title="Appointments"
      description="Phase 4 will add calendar, resource reservations, double-booking prevention and treatment interval warnings. Phase 1 confirms this route is protected by appointment permissions."
    />
  );
}
