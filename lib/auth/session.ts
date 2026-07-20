import "server-only";
import { cache } from "react";
import { rolePermissions } from "@/lib/permissions/permissions";
import type { StaffContext } from "@/lib/permissions/types";
import { createSupabaseServerClient } from "./supabase-server";

const demoStaff: StaffContext = {
  employee: {
    id: "00000000-0000-4000-8000-000000000001",
    authUserId: "demo-auth-user",
    employeeNumber: "ESC-0001",
    displayName: "Demo Owner",
    email: "owner.demo@esclare.local",
    status: "active",
    mfaRequired: true,
  },
  branches: [
    { id: "00000000-0000-4000-8000-000000000101", code: "NAGA", name: "ESCLARE Naga" },
    { id: "00000000-0000-4000-8000-000000000102", code: "DAET", name: "ESCLARE Daet" },
  ],
  activeBranch: { id: "00000000-0000-4000-8000-000000000101", code: "NAGA", name: "ESCLARE Naga" },
  activeRole: { key: "owner", name: "Owner" },
  permissions: rolePermissions.owner,
  branchPermissions: {
    "00000000-0000-4000-8000-000000000101": rolePermissions.owner,
    "00000000-0000-4000-8000-000000000102": rolePermissions.owner,
  },
};

export const getCurrentStaffContext = cache(async (): Promise<StaffContext | null> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return process.env.NODE_ENV === "production" ? null : demoStaff;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase.rpc("get_staff_context");

  if (error || !data) {
    return null;
  }

  const staff = data as StaffContext;

  if (staff.employee.mfaRequired) {
    const { data: assurance, error: assuranceError } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError || assurance.currentLevel !== "aal2") return null;
  }

  return staff;
});
