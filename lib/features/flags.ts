import { notFound } from "next/navigation";

export const FEATURES = [
  "dashboard",
  "auditRead",
  "publicBookingPersistence",
  "patients",
  "patientArchive",
  "appointments",
  "clinicalRecords",
  "clinicalPhotos",
  "payments",
  "packages",
  "inventory",
  "reports",
  "employees",
  "marketing",
  "integrations",
  "administration",
  "securitySettings",
  "dataExport",
] as const;

export type Feature = (typeof FEATURES)[number];
export type FeatureMode = "off" | "pilot" | "on";

const environmentVariables: Record<Feature, string> = {
  dashboard: "ENABLE_DASHBOARD",
  auditRead: "ENABLE_AUDIT_READ",
  publicBookingPersistence: "ENABLE_PUBLIC_BOOKING_PERSISTENCE",
  patients: "ENABLE_PATIENTS",
  patientArchive: "ENABLE_PATIENT_ARCHIVE",
  appointments: "ENABLE_APPOINTMENTS",
  clinicalRecords: "ENABLE_CLINICAL_RECORDS",
  clinicalPhotos: "ENABLE_CLINICAL_PHOTOS",
  payments: "ENABLE_PAYMENTS",
  packages: "ENABLE_PACKAGE_BALANCES",
  inventory: "ENABLE_INVENTORY",
  reports: "ENABLE_ADVANCED_REPORTS",
  employees: "ENABLE_STAFF_MANAGEMENT",
  marketing: "ENABLE_MARKETING",
  integrations: "ENABLE_INTEGRATIONS",
  administration: "ENABLE_ROLE_MANAGEMENT",
  securitySettings: "ENABLE_SECURITY_SETTINGS",
  dataExport: "ENABLE_DATA_EXPORT",
};

const developmentPilotDefaults = new Set<Feature>(["patients", "appointments", "auditRead"]);

export function getFeatureMode(feature: Feature): FeatureMode {
  const configured = process.env[environmentVariables[feature]];
  if (configured !== undefined) {
    const normalized = configured.trim().toLowerCase();
    if (normalized === "on" || normalized === "true") return "on";
    if (normalized === "pilot") return "pilot";
    return "off";
  }

  return process.env.NODE_ENV !== "production" && developmentPilotDefaults.has(feature)
    ? "pilot"
    : "off";
}

export function isFeatureEnabled(feature: Feature, staffId?: string) {
  const mode = getFeatureMode(feature);
  if (mode === "on") return true;
  if (mode === "off") return false;
  if (process.env.NODE_ENV !== "production") return true;

  const pilotStaffIds = new Set(
    (process.env.FEATURE_PILOT_STAFF_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  return Boolean(staffId && pilotStaffIds.has(staffId));
}

export function requireFeature(feature: Feature, staffId?: string) {
  if (!isFeatureEnabled(feature, staffId)) {
    notFound();
  }
}

export function getFeatureStatus() {
  return Object.fromEntries(
    FEATURES.map((feature) => [feature, getFeatureMode(feature)]),
  ) as Record<Feature, FeatureMode>;
}
