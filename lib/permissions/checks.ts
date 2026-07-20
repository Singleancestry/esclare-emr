import { notFound } from "next/navigation";
import type { Permission } from "./permissions";
import type { StaffContext } from "./types";

export function hasPermission(
  staff: StaffContext | null,
  permission: Permission,
  branchId?: string,
) {
  if (!staff) return false;
  if (!branchId) return staff.permissions.includes(permission);
  return Boolean(staff.branchPermissions?.[branchId]?.includes(permission));
}

export function hasBranchAccess(staff: StaffContext | null, branchId: string) {
  return Boolean(staff?.branches.some((branch) => branch.id === branchId));
}

export function requirePermission(
  staff: StaffContext | null,
  permission: Permission,
): asserts staff is StaffContext {
  if (!hasPermission(staff, permission)) {
    notFound();
  }
}

export function requireBranchAccess(
  staff: StaffContext | null,
  branchId: string,
): asserts staff is StaffContext {
  if (!hasBranchAccess(staff, branchId)) {
    notFound();
  }
}
