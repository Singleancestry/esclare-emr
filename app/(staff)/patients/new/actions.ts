"use server";

import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { isFeatureEnabled } from "@/lib/features/flags";
import { hasBranchAccess, hasPermission } from "@/lib/permissions/checks";
import { patientRegistrationSchema } from "@/lib/validation/patient";

export type PatientRegistrationState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export async function createPatientAction(
  _previousState: PatientRegistrationState,
  formData: FormData,
): Promise<PatientRegistrationState> {
  const staff = await getCurrentStaffContext();

  if (!staff) {
    return { status: "error", message: "Staff session is required." };
  }

  if (!isFeatureEnabled("patients", staff.employee.id)) {
    return { status: "error", message: "Patient registration is not enabled." };
  }

  const parsed = patientRegistrationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the registration form.",
    };
  }

  if (
    !hasBranchAccess(staff, parsed.data.branchId) ||
    !hasPermission(staff, "patients.create", parsed.data.branchId)
  ) {
    return { status: "error", message: "You do not have access to the selected branch." };
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return {
      status: "error",
      message: "Patient records are unavailable. Registration was not saved.",
    };
  }

  const { data, error } = await admin.rpc("create_patient_atomic", {
    p_payload: parsed.data,
    p_actor_employee_id: staff.employee.id,
  });

  if (error) {
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "A possible duplicate patient already exists. Review the directory before continuing."
          : "The patient and required intake records could not be saved.",
    };
  }

  const number =
    data && typeof data === "object" && "patientNumber" in data
      ? String(data.patientNumber)
      : "record";

  return { status: "success", message: `Patient ${number} created.` };
}
