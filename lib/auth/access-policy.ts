import type { StaffContext } from "@/lib/permissions/types";

export type StaffAccessResult =
  | { allowed: true; staff: StaffContext }
  | { allowed: false; reason: string };

export function evaluateStaffContext(staff: StaffContext | null): StaffAccessResult {
  if (!staff) {
    return { allowed: false, reason: "No active staff session." };
  }

  if (staff.employee.status === "disabled") {
    return { allowed: false, reason: "This employee account has been disabled." };
  }

  if (staff.employee.status === "pending") {
    return { allowed: false, reason: "This employee account is pending activation." };
  }

  if (!staff.activeBranch || !staff.branches.some((branch) => branch.id === staff.activeBranch.id)) {
    return { allowed: false, reason: "No permitted branch is active for this session." };
  }

  if (staff.permissions.length === 0) {
    return { allowed: false, reason: "No role permissions are assigned to this account." };
  }

  return { allowed: true, staff };
}
