"use server";

import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { hasBranchAccess, hasPermission } from "@/lib/permissions/checks";
import { patientRegistrationSchema } from "@/lib/validation/patient";
import { recordAuditEvent } from "@/lib/audit/audit-events";

export type PatientRegistrationState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

function patientNumber() {
  return `ESC-P-${Date.now().toString().slice(-8)}`;
}

export async function createPatientAction(
  _previousState: PatientRegistrationState,
  formData: FormData,
): Promise<PatientRegistrationState> {
  const staff = await getCurrentStaffContext();

  if (!staff || !hasPermission(staff, "patients.create")) {
    return { status: "error", message: "You do not have permission to create patients." };
  }

  const parsed = patientRegistrationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the registration form." };
  }

  if (!hasBranchAccess(staff, parsed.data.branchId)) {
    return { status: "error", message: "You do not have access to the selected branch." };
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return {
      status: "success",
      message: "Registration validated. Configure Supabase credentials to persist patient records.",
    };
  }

  const newPatientId = crypto.randomUUID();
  const number = patientNumber();

  const { error: patientError } = await admin.from("patients").insert({
    id: newPatientId,
    patient_number: number,
    home_branch_id: parsed.data.branchId,
    first_name: parsed.data.firstName,
    middle_name: parsed.data.middleName,
    last_name: parsed.data.lastName,
    preferred_name: parsed.data.preferredName,
    date_of_birth: parsed.data.dateOfBirth,
    sex_at_birth: parsed.data.sexAtBirth,
    gender: parsed.data.gender || null,
    civil_status: parsed.data.civilStatus || null,
    nationality: parsed.data.nationality,
    mobile: parsed.data.mobile,
    secondary_mobile: parsed.data.secondaryMobile,
    email: parsed.data.email,
    preferred_contact_method: parsed.data.preferredContactMethod,
    preferred_language: parsed.data.preferredLanguage,
    created_by: staff.employee.id,
  });

  if (patientError) {
    return { status: "error", message: patientError.message };
  }

  const writes = await Promise.all([
    admin.from("patient_branch_links").insert({
      patient_id: newPatientId,
      branch_id: parsed.data.branchId,
      created_by: staff.employee.id,
    }),
    admin.from("patient_addresses").insert({
      patient_id: newPatientId,
      country: parsed.data.country,
      region: parsed.data.region,
      province: parsed.data.province,
      city_municipality: parsed.data.cityMunicipality,
      barangay: parsed.data.barangay,
      street: parsed.data.street || null,
      building: parsed.data.building || null,
      postal_code: parsed.data.postalCode || null,
      created_by: staff.employee.id,
    }),
    admin.from("patient_emergency_contacts").insert({
      patient_id: newPatientId,
      name: parsed.data.emergencyName,
      relationship: parsed.data.emergencyRelationship,
      mobile: parsed.data.emergencyMobile,
      secondary_contact: parsed.data.emergencySecondaryContact || null,
      created_by: staff.employee.id,
    }),
    admin.from("patient_physical_information").insert({
      patient_id: newPatientId,
      height_cm: parsed.data.heightCm,
      weight_kg: parsed.data.weightKg,
      created_by: staff.employee.id,
    }),
    admin.from("patient_marketing_preferences").insert({
      patient_id: newPatientId,
      referral_source: parsed.data.referralSource || null,
      referred_by: parsed.data.referredBy || null,
      campaign: parsed.data.campaign || null,
      promo_code: parsed.data.promoCode || null,
      sms_marketing_consent: parsed.data.smsMarketingConsent,
      email_marketing_consent: parsed.data.emailMarketingConsent,
      created_by: staff.employee.id,
    }),
    admin.from("patient_privacy_acknowledgements").insert({
      patient_id: newPatientId,
      identity_verification_method: parsed.data.identityVerificationMethod,
      verified_by: parsed.data.verifiedBy,
      branch_id: parsed.data.branchId,
      created_by: staff.employee.id,
    }),
    admin.from("patient_medical_profiles").insert({
      patient_id: newPatientId,
      alert_level: "informational",
      alert_reason: "Initial intake pending medical profile review.",
      created_by: staff.employee.id,
    }),
  ]);

  const writeError = writes.find((result) => result.error)?.error;

  if (writeError) {
    return { status: "error", message: writeError.message };
  }

  await recordAuditEvent({
    actorEmployeeId: staff.employee.id,
    actorRole: staff.activeRole.key,
    branchId: parsed.data.branchId,
    action: "patient.create",
    entityType: "patients",
    entityId: newPatientId,
    patientId: newPatientId,
    reason: "Patient registration",
    success: true,
  });

  return { status: "success", message: `Patient ${number} created.` };
}
