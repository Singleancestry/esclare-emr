import type { Permission } from "./permissions";

export const protectedRoutePermissions: Record<string, Permission> = {
  "/dashboard": "dashboard.branch.view",
  "/admin": "security.manage_roles",
  "/settings": "security.view_audit",
  "/patients": "patients.view_basic",
  "/patients/new": "patients.create",
  "/patients/archived": "patients.archive",
  "/settings/audit": "security.view_audit",
  "/appointments": "appointments.view",
  "/clinical": "medical.view_summary",
  "/services": "services.view",
  "/packages": "packages.view",
  "/pos": "payments.view",
  "/inventory": "inventory.view",
  "/finance": "reports.view_branch",
  "/employees": "employees.view",
  "/marketing": "patients.view_basic",
  "/reports": "reports.view_branch",
  "/integrations": "prices.view",
};
