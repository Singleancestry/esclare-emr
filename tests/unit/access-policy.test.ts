import { describe, expect, it } from "vitest";
import { evaluateStaffContext } from "@/lib/auth/access-policy";
import { rolePermissions } from "@/lib/permissions/permissions";
import type { StaffContext } from "@/lib/permissions/types";

const baseStaff: StaffContext = {
  employee: {
    id: "employee-1",
    authUserId: "auth-1",
    employeeNumber: "ESC-0001",
    displayName: "Demo Owner",
    email: "owner.demo@esclare.local",
    status: "active",
    mfaRequired: true,
  },
  branches: [{ id: "branch-1", code: "NAGA", name: "ESCLARE Naga" }],
  activeBranch: { id: "branch-1", code: "NAGA", name: "ESCLARE Naga" },
  activeRole: { key: "owner", name: "Owner" },
  permissions: rolePermissions.owner,
};

describe("evaluateStaffContext", () => {
  it("allows an active employee with branch and permissions", () => {
    expect(evaluateStaffContext(baseStaff).allowed).toBe(true);
  });

  it("blocks disabled employees", () => {
    const result = evaluateStaffContext({
      ...baseStaff,
      employee: { ...baseStaff.employee, status: "disabled" },
    });

    expect(result).toEqual({
      allowed: false,
      reason: "This employee account has been disabled.",
    });
  });

  it("blocks sessions without active branch access", () => {
    const result = evaluateStaffContext({
      ...baseStaff,
      activeBranch: { id: "branch-2", code: "DAET", name: "ESCLARE Daet" },
    });

    expect(result).toEqual({
      allowed: false,
      reason: "No permitted branch is active for this session.",
    });
  });

  it("blocks sessions without permissions", () => {
    const result = evaluateStaffContext({
      ...baseStaff,
      permissions: [],
    });

    expect(result).toEqual({
      allowed: false,
      reason: "No role permissions are assigned to this account.",
    });
  });
});
