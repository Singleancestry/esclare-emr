import "server-only";
import { evaluateStaffContext, type StaffAccessResult } from "./access-policy";
import { getCurrentStaffContext } from "./session";

export async function evaluateStaffAccess(): Promise<StaffAccessResult> {
  return evaluateStaffContext(await getCurrentStaffContext());
}
