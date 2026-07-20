export type ClinicalAlertLevel =
  | "none"
  | "informational"
  | "caution"
  | "doctor_review_required"
  | "treatment_blocked"
  | "emergency";

export type PatientDirectoryRecord = {
  id: string;
  patientNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  preferredName: string | null;
  sexAtBirth: string;
  dateOfBirth: string;
  homeBranchId: string;
  homeBranchName: string;
  maskedMobile: string;
  remainingSessions: number;
  outstandingBalance: number;
  loyaltyPoints: number;
  lastVisitAt: string | null;
  nextAppointmentAt: string | null;
  clinicalAlertLevel: ClinicalAlertLevel;
  archivedAt: string | null;
};

export type MedicalProfileSummary = {
  alertLevel: ClinicalAlertLevel;
  alertReason: string | null;
  allergies: string[];
  currentMedications: string[];
  medicalConditions: string[];
  pregnancyStatus: "not_applicable" | "no" | "yes" | "unknown";
  breastfeeding: boolean | null;
  keloidHistory: boolean | null;
  photosensitivity: boolean | null;
  diabetes: boolean | null;
  hypertension: boolean | null;
  otherClinicalNotes: string | null;
  updatedAt: string;
};

export type PatientProfile = PatientDirectoryRecord & {
  age: number;
  address: {
    country: string;
    region: string | null;
    province: string | null;
    cityMunicipality: string | null;
    barangay: string | null;
    street: string | null;
    building: string | null;
    postalCode: string | null;
  } | null;
  emergencyContact: {
    name: string;
    relationship: string;
    mobile: string;
    secondaryContact: string | null;
  } | null;
  physicalInfo: {
    heightCm: number | null;
    weightKg: number | null;
    bmi: number | null;
  } | null;
  medicalProfile: MedicalProfileSummary | null;
};

export type PatientAuditRecord = {
  id: string;
  action: string;
  entityType: string;
  reason: string | null;
  actorRole: string | null;
  branchId: string | null;
  createdAt: string;
  success: boolean;
};
