import "server-only";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import type { StaffContext } from "@/lib/permissions/types";
import { calculateAge, calculateBmi, maskPhilippineMobile } from "./utils";
import { demoPatientAudit, demoPatients } from "./demo-data";
import type { PatientAuditRecord, PatientDirectoryRecord, PatientProfile } from "./types";

type PatientRow = {
  id: string;
  patient_number: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  preferred_name: string | null;
  sex_at_birth: string;
  date_of_birth: string;
  home_branch_id: string;
  mobile: string;
  email: string | null;
  remaining_sessions_demo: number;
  outstanding_balance_demo: number;
  loyalty_points: number;
  last_visit_at: string | null;
  next_appointment_at: string | null;
  clinical_alert_level: PatientDirectoryRecord["clinicalAlertLevel"];
  archived_at: string | null;
  branches: { name: string } | null;
};

type AddressRow = {
  country: string;
  region: string | null;
  province: string | null;
  city_municipality: string | null;
  barangay: string | null;
  street: string | null;
  building: string | null;
  postal_code: string | null;
};

type EmergencyContactRow = {
  name: string;
  relationship: string;
  mobile: string;
  secondary_contact: string | null;
};

type PhysicalInfoRow = {
  height_cm: number | null;
  weight_kg: number | null;
};

type MedicalProfileRow = {
  alert_level: PatientDirectoryRecord["clinicalAlertLevel"];
  alert_reason: string | null;
  allergies: string[] | null;
  current_medications: string[] | null;
  medical_conditions: string[] | null;
  pregnancy_status: "not_applicable" | "no" | "yes" | "unknown";
  breastfeeding: boolean | null;
  keloid_history: boolean | null;
  photosensitivity: boolean | null;
  diabetes: boolean | null;
  hypertension: boolean | null;
  other_clinical_notes: string | null;
  updated_at: string;
};

function mapDirectoryRow(row: PatientRow): PatientDirectoryRecord {
  return {
    id: row.id,
    patientNumber: row.patient_number,
    firstName: row.first_name,
    middleName: row.middle_name,
    lastName: row.last_name,
    preferredName: row.preferred_name,
    sexAtBirth: row.sex_at_birth,
    dateOfBirth: row.date_of_birth,
    homeBranchId: row.home_branch_id,
    homeBranchName: row.branches?.name ?? "Assigned branch",
    maskedMobile: maskPhilippineMobile(row.mobile),
    mobile: row.mobile,
    email: row.email,
    remainingSessions: row.remaining_sessions_demo,
    outstandingBalance: row.outstanding_balance_demo,
    loyaltyPoints: row.loyalty_points,
    lastVisitAt: row.last_visit_at,
    nextAppointmentAt: row.next_appointment_at,
    clinicalAlertLevel: row.clinical_alert_level,
    archivedAt: row.archived_at,
  };
}

export async function getPatientDirectory(staff: StaffContext): Promise<PatientDirectoryRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return demoPatients.filter((patient) =>
      staff.branches.some((branch) => branch.id === patient.homeBranchId),
    );
  }

  const { data, error } = await supabase
    .from("patients")
    .select(
      "id, patient_number, first_name, middle_name, last_name, preferred_name, sex_at_birth, date_of_birth, home_branch_id, mobile, email, remaining_sessions_demo, outstanding_balance_demo, loyalty_points, last_visit_at, next_appointment_at, clinical_alert_level, archived_at, branches:home_branch_id(name)",
    )
    .order("last_name", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as unknown as PatientRow[]).map(mapDirectoryRow);
}

export async function getPatientProfile(
  staff: StaffContext,
  patientId: string,
): Promise<PatientProfile | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const patient = demoPatients.find((item) => item.id === patientId);
    return patient && staff.branches.some((branch) => branch.id === patient.homeBranchId)
      ? patient
      : null;
  }

  const { data: patientData, error: patientError } = await supabase
    .from("patients")
    .select(
      "id, patient_number, first_name, middle_name, last_name, preferred_name, sex_at_birth, date_of_birth, home_branch_id, mobile, email, remaining_sessions_demo, outstanding_balance_demo, loyalty_points, last_visit_at, next_appointment_at, clinical_alert_level, archived_at, branches:home_branch_id(name)",
    )
    .eq("id", patientId)
    .maybeSingle();

  if (patientError || !patientData) {
    return null;
  }

  const base = mapDirectoryRow(patientData as unknown as PatientRow);
  const [addressResult, emergencyResult, physicalResult, medicalResult] = await Promise.all([
    supabase.from("patient_addresses").select("*").eq("patient_id", patientId).maybeSingle(),
    supabase
      .from("patient_emergency_contacts")
      .select("*")
      .eq("patient_id", patientId)
      .maybeSingle(),
    supabase
      .from("patient_physical_information")
      .select("*")
      .eq("patient_id", patientId)
      .maybeSingle(),
    supabase.from("patient_medical_profiles").select("*").eq("patient_id", patientId).maybeSingle(),
  ]);

  const address = addressResult.data as unknown as AddressRow | null;
  const emergency = emergencyResult.data as unknown as EmergencyContactRow | null;
  const physical = physicalResult.data as unknown as PhysicalInfoRow | null;
  const medical = medicalResult.data as unknown as MedicalProfileRow | null;

  return {
    ...base,
    age: calculateAge(base.dateOfBirth),
    address: address
      ? {
          country: address.country,
          region: address.region,
          province: address.province,
          cityMunicipality: address.city_municipality,
          barangay: address.barangay,
          street: address.street,
          building: address.building,
          postalCode: address.postal_code,
        }
      : null,
    emergencyContact: emergency
      ? {
          name: emergency.name,
          relationship: emergency.relationship,
          mobile: emergency.mobile,
          secondaryContact: emergency.secondary_contact,
        }
      : null,
    physicalInfo: physical
      ? {
          heightCm: physical.height_cm,
          weightKg: physical.weight_kg,
          bmi: calculateBmi(physical.height_cm, physical.weight_kg),
        }
      : null,
    medicalProfile: medical
      ? {
          alertLevel: medical.alert_level,
          alertReason: medical.alert_reason,
          allergies: medical.allergies ?? [],
          currentMedications: medical.current_medications ?? [],
          medicalConditions: medical.medical_conditions ?? [],
          pregnancyStatus: medical.pregnancy_status,
          breastfeeding: medical.breastfeeding,
          keloidHistory: medical.keloid_history,
          photosensitivity: medical.photosensitivity,
          diabetes: medical.diabetes,
          hypertension: medical.hypertension,
          otherClinicalNotes: medical.other_clinical_notes,
          updatedAt: medical.updated_at,
        }
      : null,
  };
}

export async function getPatientAudit(patientId?: string): Promise<PatientAuditRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return demoPatientAudit;
  }

  let query = supabase
    .from("audit_events")
    .select("id, action, entity_type, reason, actor_role, branch_id, created_at, success")
    .order("created_at", { ascending: false })
    .limit(50);

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (
    data as unknown as Array<{
      id: string;
      action: string;
      entity_type: string;
      reason: string | null;
      actor_role: string | null;
      branch_id: string | null;
      created_at: string;
      success: boolean;
    }>
  ).map((event) => ({
    id: event.id,
    action: event.action,
    entityType: event.entity_type,
    reason: event.reason,
    actorRole: event.actor_role,
    branchId: event.branch_id,
    createdAt: event.created_at,
    success: event.success,
  }));
}

export async function getPatientFullContact(patientId: string) {
  const demoPatient = demoPatients.find((patient) => patient.id === patientId);
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return demoPatient ? { mobile: demoPatient.mobile, email: demoPatient.email } : null;
  }

  const { data, error } = await admin
    .from("patients")
    .select("mobile, email")
    .eq("id", patientId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as { mobile: string; email: string | null };
}
