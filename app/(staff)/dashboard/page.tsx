import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function DashboardPage() {
  const staff = await getCurrentStaffContext();
  requireFeature("dashboard", staff?.employee.id);
  requirePermission(staff, "dashboard.branch.view");

  return <DashboardShell staff={staff} />;
}
