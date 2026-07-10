import Link from "next/link";
import type { Route } from "next";
import { Plus } from "lucide-react";
import { PatientDirectory } from "@/components/patients/patient-directory";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { getPatientDirectory } from "@/lib/patients/data";
import { hasPermission, requirePermission } from "@/lib/permissions/checks";

export default async function PatientsPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "patients.view_basic");
  const patients = await getPatientDirectory(staff);

  return (
    <main className="grid gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6F263D]">Patient records</p>
          <h1 className="text-3xl font-semibold text-[#481827]">Patient Directory</h1>
        </div>
        {hasPermission(staff, "patients.create") ? (
          <Link
            href={"/patients/new" as Route}
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded bg-[#6F263D] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={17} aria-hidden /> Add patient
          </Link>
        ) : null}
      </div>
      <PatientDirectory patients={patients} canRevealContact={hasPermission(staff, "patients.reveal_contact")} />
    </main>
  );
}
