import { ShieldCheck } from "lucide-react";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { requirePermission } from "@/lib/permissions/checks";

export default async function AdminPage() {
  requireFeature("administration");
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "security.manage_roles");

  return (
    <main className="p-6">
      <div className="rounded border border-[#D9DDE3] bg-white p-6">
        <ShieldCheck className="text-[#6F263D]" aria-hidden />
        <h1 className="mt-4 text-3xl font-semibold text-[#481827]">Administration</h1>
        <p className="mt-2 text-sm text-[#5F6368]">
          Role, permission, branch access and trusted-device workflows start from this secured area.
        </p>
      </div>
    </main>
  );
}
