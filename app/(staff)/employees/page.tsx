import { ProtectedPlaceholder } from "@/components/shared/protected-placeholder";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function EmployeesPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "employees.view");

  return (
    <ProtectedPlaceholder
      title="Employees"
      description="Employee directory, attendance, assigned treatments, commissions, trusted devices and access logs build from the Phase 1 auth foundation."
    />
  );
}
