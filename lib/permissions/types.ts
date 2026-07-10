import type { Permission, RoleKey } from "./permissions";

export type BranchAccess = {
  id: string;
  code: string;
  name: string;
};

export type EmployeeProfile = {
  id: string;
  authUserId: string;
  employeeNumber: string;
  displayName: string;
  email: string;
  status: "active" | "disabled" | "pending";
  mfaRequired: boolean;
};

export type StaffContext = {
  employee: EmployeeProfile;
  branches: BranchAccess[];
  activeBranch: BranchAccess;
  activeRole: {
    key: RoleKey;
    name: string;
  };
  permissions: Permission[];
};
