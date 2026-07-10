import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function DashboardPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "dashboard.branch.view");

  return <DashboardShell staff={staff} />;
}
