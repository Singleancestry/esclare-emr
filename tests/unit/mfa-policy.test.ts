import { describe, expect, it } from "vitest";
import { requiresStaffMfa } from "@/lib/auth/mfa-policy";

describe("staff MFA policy", () => {
  it.each([
    "owner",
    "super_admin",
    "administrator",
    "branch_manager",
    "doctor",
    "cashier",
    "finance",
    "auditor",
  ])("requires MFA for the privileged %s role", (roleKey) => {
    expect(requiresStaffMfa(false, roleKey)).toBe(true);
  });

  it("preserves the per-user MFA requirement for every role", () => {
    expect(requiresStaffMfa(true, "receptionist")).toBe(true);
  });

  it("does not force MFA for an unflagged non-privileged role", () => {
    expect(requiresStaffMfa(false, "aesthetician")).toBe(false);
  });
});
