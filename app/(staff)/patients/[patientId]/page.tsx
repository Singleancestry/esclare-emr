import { notFound } from "next/navigation";
import { PatientProfile } from "@/components/patients/patient-profile";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { getPatientProfile } from "@/lib/patients/data";
import { hasPermission, requirePermission } from "@/lib/permissions/checks";

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "patients.view_basic");

  const { patientId } = await params;
  const patient = await getPatientProfile(staff, patientId);

  if (!patient) {
    notFound();
  }

  return <PatientProfile patient={patient} canViewFullMedical={hasPermission(staff, "medical.view_full")} />;
}
