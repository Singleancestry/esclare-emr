import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function SettingsPage() {
  requireFeature("securitySettings");
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "security.view_audit");

  return (
    <main className="p-6">
      <h1 className="text-3xl font-semibold text-[#481827]">Settings and Security</h1>
      <p className="mt-2 text-sm text-[#5F6368]">
        Audit logs, access controls and security settings are protected by explicit permissions.
      </p>
    </main>
  );
}
