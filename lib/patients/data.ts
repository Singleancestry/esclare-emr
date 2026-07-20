import "server-only";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import type { StaffContext } from "@/lib/permissions/types";
import { hasPermission } from "@/lib/permissions/checks";
import { calculateAge, calculateBmi } from "./utils";
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
  masked_mobile: string | null;
  remaining_sessions_demo: number;
  outstanding_balance_demo: number;
  loyalty_points: number;
  last_visit_at: string | null;
  next_appointment_at: string | null;
  clinical_alert_level: PatientDirectoryRecord["clinicalAlertLevel"];
  archived_at: string | null;
  branches: { name: string } | null;
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
    maskedMobile: row.masked_mobile ?? "Contact hidden",
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
  const supabase = createSupabaseAdminClient();
  const branchIds = staff.branches
    .filter((branch) => hasPermission(staff, "patients.view_basic", branch.id))
    .map((branch) => branch.id);

  if (!supabase) {
    if (process.env.NODE_ENV === "production") return [];
    return demoPatients.filter((patient) => branchIds.includes(patient.homeBranchId));
  }

  if (branchIds.length === 0) return [];

  let { data, error } = await supabase
    .from("patients")
    .select(
      "id, patient_number, first_name, middle_name, last_name, preferred_name, sex_at_birth, date_of_birth, home_branch_id, masked_mobile, remaining_sessions_demo, outstanding_balance_demo, loyalty_points, last_visit_at, next_appointment_at, clinical_alert_level, archived_at, branches:home_branch_id(name)",
    )
    .in("home_branch_id", branchIds)
    .order("last_name", { ascending: true })
    .limit(500);

  if (error?.code === "42703") {
    const fallback = await supabase
      .from("patients")
      .select(
        "id, patient_number, first_name, middle_name, last_name, preferred_name, sex_at_birth, date_of_birth, home_branch_id, remaining_sessions_demo, outstanding_balance_demo, loyalty_points, last_visit_at, next_appointment_at, clinical_alert_level, archived_at, branches:home_branch_id(name)",
      )
      .in("home_branch_id", branchIds)
      .order("last_name", { ascending: true })
      .limit(500);
    data = fallback.data as typeof data;
    error = fallback.error;
  }

  if (error || !data) {
    throw new Error("Patient directory is temporarily unavailable.");
  }

  return (data as unknown as PatientRow[]).map(mapDirectoryRow);
}

export async function getPatientProfile(
  staff: StaffContext,
  patientId: string,
): Promise<PatientProfile | null> {
  const supabase = createSupabaseAdminClient();
  const branchIds = staff.branches
    .filter((branch) => hasPermission(staff, "patients.view_basic", branch.id))
    .map((branch) => branch.id);

  if (!supabase) {
    if (process.env.NODE_ENV === "production") return null;
    const patient = demoPatients.find((item) => item.id === patientId);
    return patient && branchIds.includes(patient.homeBranchId) ? patient : null;
  }

  let { data: patientData, error: patientError } = await supabase
    .from("patients")
    .select(
      "id, patient_number, first_name, middle_name, last_name, preferred_name, sex_at_birth, date_of_birth, home_branch_id, masked_mobile, remaining_sessions_demo, outstanding_balance_demo, loyalty_points, last_visit_at, next_appointment_at, clinical_alert_level, archived_at, branches:home_branch_id(name)",
    )
    .eq("id", patientId)
    .in("home_branch_id", branchIds)
    .maybeSingle();

  if (patientError?.code === "42703") {
    const fallback = await supabase
      .from("patients")
      .select(
        "id, patient_number, first_name, middle_name, last_name, preferred_name, sex_at_birth, date_of_birth, home_branch_id, remaining_sessions_demo, outstanding_balance_demo, loyalty_points, last_visit_at, next_appointment_at, clinical_alert_level, archived_at, branches:home_branch_id(name)",
      )
      .eq("id", patientId)
      .in("home_branch_id", branchIds)
      .maybeSingle();
    patientData = fallback.data as typeof patientData;
    patientError = fallback.error;
  }

  if (patientError || !patientData) {
    if (patientError) throw new Error("Patient profile is temporarily unavailable.");
    return null;
  }

  const base = mapDirectoryRow(patientData as unknown as PatientRow);
  const admin = supabase;
  const canViewFullMedical = hasPermission(staff, "medical.view_full", base.homeBranchId);
  const canViewMedicalSummary =
    canViewFullMedical || hasPermission(staff, "medical.view_summary", base.homeBranchId);
  const [physicalResult, medicalResult] = await Promise.all([
    admin && canViewFullMedical
      ? admin
          .from("patient_physical_information")
          .select("height_cm, weight_kg")
          .eq("patient_id", patientId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    admin && canViewMedicalSummary
      ? admin
          .from("patient_medical_profiles")
          .select(
            canViewFullMedical
              ? "alert_level, alert_reason, allergies, current_medications, medical_conditions, pregnancy_status, breastfeeding, keloid_history, photosensitivity, diabetes, hypertension, other_clinical_notes, updated_at"
              : "alert_level, updated_at",
          )
          .eq("patient_id", patientId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const physical = physicalResult.data as unknown as PhysicalInfoRow | null;
  const medical = medicalResult.data as unknown as Partial<MedicalProfileRow> | null;

  return {
    ...base,
    age: calculateAge(base.dateOfBirth),
    address: null,
    emergencyContact: null,
    physicalInfo: physical
      ? {
          heightCm: physical.height_cm,
          weightKg: physical.weight_kg,
          bmi: calculateBmi(physical.height_cm, physical.weight_kg),
        }
      : null,
    medicalProfile: medical
      ? {
          alertLevel: medical.alert_level ?? "none",
          alertReason: medical.alert_reason ?? null,
          allergies: medical.allergies ?? [],
          currentMedications: medical.current_medications ?? [],
          medicalConditions: medical.medical_conditions ?? [],
          pregnancyStatus: medical.pregnancy_status ?? "unknown",
          breastfeeding: medical.breastfeeding ?? null,
          keloidHistory: medical.keloid_history ?? null,
          photosensitivity: medical.photosensitivity ?? null,
          diabetes: medical.diabetes ?? null,
          hypertension: medical.hypertension ?? null,
          otherClinicalNotes: medical.other_clinical_notes ?? null,
          updatedAt: medical.updated_at ?? new Date(0).toISOString(),
        }
      : null,
  };
}

export async function getPatientAudit(patientId?: string): Promise<PatientAuditRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    if (process.env.NODE_ENV === "production") return [];
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
    throw new Error("Audit history is temporarily unavailable.");
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
