import { describe, expect, it } from "vitest";
import { getAuthorizedNavigation } from "@/lib/permissions/navigation";
import { rolePermissions } from "@/lib/permissions/permissions";
import { protectedRoutePermissions } from "@/lib/permissions/routes";
import type { StaffContext } from "@/lib/permissions/types";

function staffWithRole(role: "owner" | "receptionist" | "cashier" | "doctor"): StaffContext {
  return {
    employee: {
      id: `employee-${role}`,
      authUserId: `auth-${role}`,
      employeeNumber: `ESC-${role}`,
      displayName: role,
      email: `${role}@esclare.local`,
      status: "active",
      mfaRequired: role === "owner" || role === "doctor",
    },
    branches: [{ id: "branch-1", code: "NAGA", name: "ESCLARE Naga" }],
    activeBranch: { id: "branch-1", code: "NAGA", name: "ESCLARE Naga" },
    activeRole: { key: role, name: role },
    permissions: rolePermissions[role],
    branchPermissions: { "branch-1": rolePermissions[role] },
  };
}

describe("permissions", () => {
  it("keeps admin routes hidden from receptionist navigation", () => {
    const nav = getAuthorizedNavigation(staffWithRole("receptionist"));

    expect(nav.map((item) => item.href)).not.toContain("/admin");
    expect(nav.map((item) => item.href)).toContain("/patients");
  });

  it("keeps unfinished cashier and clinical modules hidden by default", () => {
    const nav = getAuthorizedNavigation(staffWithRole("cashier"));
    const hrefs = nav.map((item) => item.href);

    expect(hrefs).not.toContain("/pos");
    expect(hrefs).not.toContain("/clinical");
  });

  it("keeps enabled pilot workflows visible in non-production environments", () => {
    const hrefs = getAuthorizedNavigation(staffWithRole("receptionist")).map((item) => item.href);

    expect(hrefs).toContain("/patients");
    expect(hrefs).toContain("/appointments");
    expect(hrefs).not.toContain("/patients/archived");
  });

  it("maps protected routes to explicit permissions", () => {
    expect(protectedRoutePermissions["/dashboard"]).toBe("dashboard.branch.view");
    expect(protectedRoutePermissions["/admin"]).toBe("security.manage_roles");
    expect(protectedRoutePermissions["/clinical"]).toBe("medical.view_summary");
    expect(protectedRoutePermissions["/patients/new"]).toBe("patients.create");
    expect(protectedRoutePermissions["/settings/audit"]).toBe("security.view_audit");
  });

  it("gives doctors medical sign permission but not payment creation", () => {
    const doctor = staffWithRole("doctor");

    expect(doctor.permissions).toContain("medical.sign");
    expect(doctor.permissions).not.toContain("payments.create");
  });
});
