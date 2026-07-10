import { PatientRegistrationForm } from "@/components/patients/patient-registration-form";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";

export default async function NewPatientPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "patients.create");

  return (
    <main className="grid gap-5 p-4 sm:p-6">
      <div>
        <p className="text-sm font-semibold uppercase text-[#6F263D]">Registration</p>
        <h1 className="text-3xl font-semibold text-[#481827]">Add Patient</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5F6368]">
          Create a master patient profile with masked contact defaults, branch linkage, privacy
          acknowledgement, duplicate-screening data, and an initial medical-profile shell.
        </p>
      </div>
      <PatientRegistrationForm branches={staff.branches} verifierName={staff.employee.displayName} />
    </main>
  );
}
