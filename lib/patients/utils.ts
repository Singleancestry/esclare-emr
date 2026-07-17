import type { ClinicalAlertLevel, PatientDirectoryRecord } from "./types";

export function calculateAge(dateOfBirth: string, now = new Date()) {
  const dob = new Date(`${dateOfBirth}T00:00:00`);
  let age = now.getFullYear() - dob.getFullYear();
  const monthDelta = now.getMonth() - dob.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
}

export function calculateBmi(heightCm?: number | null, weightKg?: number | null) {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function maskPhilippineMobile(mobile: string) {
  const normalized = mobile.replace(/\D/g, "");
  const local = normalized.startsWith("63") ? `0${normalized.slice(2)}` : normalized;

  if (local.length !== 11) {
    return "Masked";
  }

  return `${local.slice(0, 4)} *** ${local.slice(7)}`;
}

export function formatPatientName(
  patient: Pick<PatientDirectoryRecord, "firstName" | "lastName" | "preferredName">,
) {
  return patient.preferredName
    ? `${patient.firstName} "${patient.preferredName}" ${patient.lastName}`
    : `${patient.firstName} ${patient.lastName}`;
}

export function alertTone(level: ClinicalAlertLevel) {
  const tones: Record<ClinicalAlertLevel, string> = {
    none: "bg-[#F4F6F8] text-[#5F6368]",
    informational: "bg-[#EAF1FC] text-[#316FC4]",
    caution: "bg-[#FFF5E5] text-[#9A6114]",
    doctor_review_required: "bg-[#FFF5E5] text-[#9A6114]",
    treatment_blocked: "bg-[#FFF0F2] text-[#9B2130]",
    emergency: "bg-[#FFF0F2] text-[#9B2130]",
  };

  return tones[level];
}
