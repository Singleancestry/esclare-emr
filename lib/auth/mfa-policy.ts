const PRIVILEGED_MFA_ROLES = new Set([
  "owner",
  "super_admin",
  "administrator",
  "branch_manager",
  "doctor",
  "cashier",
  "finance",
  "auditor",
]);

export function requiresStaffMfa(mfaRequired: boolean, roleKey?: string | null): boolean {
  return mfaRequired || (roleKey ? PRIVILEGED_MFA_ROLES.has(roleKey) : false);
}
