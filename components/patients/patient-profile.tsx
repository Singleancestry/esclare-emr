import {
  AlertTriangle,
  CalendarDays,
  CircleDollarSign,
  Gift,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import type { PatientProfile as PatientProfileType } from "@/lib/patients/types";
import { alertTone, formatPatientName } from "@/lib/patients/utils";

type PatientProfileProps = {
  patient: PatientProfileType;
  canViewFullMedical: boolean;
};

const tabs = [
  "Overview",
  "Medical Profile",
  "Allergies",
  "Health Concerns",
  "Appointments",
  "Treatment History",
  "Packages and Sessions",
  "Clinical Photos",
  "Consent Forms",
  "Payments",
  "Aftercare",
  "Communications",
  "Documents",
  "Audit History",
];

export function PatientProfile({ patient, canViewFullMedical }: PatientProfileProps) {
  return (
    <main className="p-4 sm:p-6">
      <section className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded bg-[#6F263D] font-serif text-2xl font-semibold text-white">
            {patient.firstName[0]}
            {patient.lastName[0]}
          </div>
          <div className="min-w-[220px] flex-1">
            <p className="text-sm font-semibold uppercase text-[#6F263D]">
              {patient.patientNumber}
            </p>
            <h1 className="text-3xl font-semibold text-[#481827]">{formatPatientName(patient)}</h1>
            <p className="mt-1 text-sm text-[#5F6368]">
              {patient.homeBranchName} · {patient.age} years · {patient.maskedMobile}
            </p>
          </div>
          <span
            className={`rounded px-3 py-2 text-sm font-semibold ${alertTone(patient.clinicalAlertLevel)}`}
          >
            {patient.clinicalAlertLevel.replaceAll("_", " ")}
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <HeaderMetric
            icon={CircleDollarSign}
            label="Outstanding balance"
            value={`PHP ${patient.outstandingBalance.toLocaleString()}`}
          />
          <HeaderMetric
            icon={Gift}
            label="Remaining sessions"
            value={patient.remainingSessions.toString()}
          />
          <HeaderMetric
            icon={ShieldCheck}
            label="Loyalty points"
            value={patient.loyaltyPoints.toString()}
          />
          <HeaderMetric
            icon={CalendarDays}
            label="Next appointment"
            value={
              patient.nextAppointmentAt
                ? new Date(patient.nextAppointmentAt).toLocaleString()
                : "None"
            }
          />
        </div>
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Patient profile tabs">
        {tabs.map((tab, index) => (
          <a
            key={tab}
            className="focus-ring shrink-0 rounded border border-[#D9DDE3] bg-white px-3 py-2 text-sm font-semibold text-[#481827] data-[active=true]:border-[#C6A467] data-[active=true]:bg-[#F8F4ED]"
            href={`#${tab.toLowerCase().replaceAll(" ", "-")}`}
            data-active={index === 0}
          >
            {tab}
          </a>
        ))}
      </nav>

      <section id="overview" className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <article className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-[#481827]">Overview</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <Info label="Email" value={patient.email ?? "Not provided"} />
            <Info
              label="Address"
              value={
                patient.address
                  ? `${patient.address.cityMunicipality}, ${patient.address.province}`
                  : "Not provided"
              }
            />
            <Info
              label="Emergency contact"
              value={
                patient.emergencyContact
                  ? `${patient.emergencyContact.name} (${patient.emergencyContact.relationship})`
                  : "Not provided"
              }
            />
            <Info label="BMI" value={patient.physicalInfo?.bmi?.toString() ?? "Not recorded"} />
          </dl>
        </article>
        <MedicalProfilePanel patient={patient} canViewFullMedical={canViewFullMedical} />
      </section>
    </main>
  );
}

function MedicalProfilePanel({
  patient,
  canViewFullMedical,
}: {
  patient: PatientProfileType;
  canViewFullMedical: boolean;
}) {
  const medical = patient.medicalProfile;

  if (!medical) {
    return (
      <article
        id="medical-profile"
        className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-[#481827]">Medical Profile</h2>
        <p className="mt-3 text-sm text-[#5F6368]">No medical profile is recorded yet.</p>
      </article>
    );
  }

  return (
    <article
      id="medical-profile"
      className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <HeartPulse className="text-[#6F263D]" size={20} aria-hidden />
        <h2 className="text-xl font-semibold text-[#481827]">Medical Profile</h2>
      </div>
      <div className="mt-4 rounded border border-[#D9DDE3] bg-[#F8F4ED] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 text-[#C38221]" size={18} aria-hidden />
          <div>
            <p className="text-sm font-semibold text-[#481827]">
              Alert level: {medical.alertLevel.replaceAll("_", " ")}
            </p>
            <p className="mt-1 text-sm text-[#5F6368]">
              {canViewFullMedical
                ? (medical.alertReason ?? "No alert reason recorded.")
                : "Full diagnosis and notes require medical.view_full permission."}
            </p>
          </div>
        </div>
      </div>
      {canViewFullMedical ? (
        <dl className="mt-4 grid gap-3 md:grid-cols-2">
          <Info
            label="Allergies"
            value={medical.allergies.length ? medical.allergies.join(", ") : "None recorded"}
          />
          <Info
            label="Current medications"
            value={
              medical.currentMedications.length
                ? medical.currentMedications.join(", ")
                : "None recorded"
            }
          />
          <Info
            label="Medical conditions"
            value={
              medical.medicalConditions.length
                ? medical.medicalConditions.join(", ")
                : "None recorded"
            }
          />
          <Info label="Pregnancy" value={medical.pregnancyStatus.replaceAll("_", " ")} />
          <Info
            label="Photosensitivity"
            value={
              medical.photosensitivity === null
                ? "Unknown"
                : medical.photosensitivity
                  ? "Yes"
                  : "No"
            }
          />
          <Info
            label="Hypertension"
            value={medical.hypertension === null ? "Unknown" : medical.hypertension ? "Yes" : "No"}
          />
          <Info label="Clinical notes" value={medical.otherClinicalNotes ?? "None recorded"} />
        </dl>
      ) : null}
    </article>
  );
}

function HeaderMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded border border-[#D9DDE3] bg-[#F8F4ED] p-3">
      <Icon className="text-[#6F263D]" size={18} aria-hidden />
      <p className="mt-2 text-xs font-semibold uppercase text-[#6F263D]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#262626]">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-[#6F263D]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[#262626]">{value}</dd>
    </div>
  );
}
