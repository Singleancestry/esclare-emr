"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Eye, Grid2X2, List, Search } from "lucide-react";
import type { PatientDirectoryRecord } from "@/lib/patients/types";
import { alertTone, formatPatientName } from "@/lib/patients/utils";
import { Button } from "@/components/ui/button";

type PatientDirectoryProps = {
  patients: PatientDirectoryRecord[];
  canRevealContact: boolean;
};

type RevealedContact = {
  mobile: string;
  email: string | null;
};

export function PatientDirectory({ patients, canRevealContact }: PatientDirectoryProps) {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("all");
  const [revealed, setRevealed] = useState<Record<string, RevealedContact>>({});
  const [message, setMessage] = useState<string | null>(null);

  const branches = useMemo(
    () =>
      Array.from(
        new Map(
          patients.map((patient) => [patient.homeBranchId, patient.homeBranchName]),
        ).entries(),
      ),
    [patients],
  );

  const filteredPatients = patients.filter((patient) => {
    const text =
      `${patient.firstName} ${patient.lastName} ${patient.patientNumber} ${patient.maskedMobile}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesBranch = branch === "all" || patient.homeBranchId === branch;
    return matchesQuery && matchesBranch && !patient.archivedAt;
  });

  async function revealContact(patientId: string) {
    setMessage(null);
    const reason = window.prompt("Reason for revealing patient contact?");

    if (!reason) {
      return;
    }

    const response = await fetch(`/api/patients/${patientId}/reveal-contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    const payload = (await response.json()) as RevealedContact | { error: string };

    if (!response.ok || "error" in payload) {
      setMessage("Contact reveal was denied or could not be logged.");
      return;
    }

    setRevealed((current) => ({ ...current, [patientId]: payload }));
    setMessage("Contact reveal logged.");
  }

  return (
    <section className="grid gap-4">
      <div className="rounded border border-[#D9DDE3] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F263D]"
              size={17}
              aria-hidden
            />
            <label className="sr-only" htmlFor="patient-filter">
              Search patients
            </label>
            <input
              id="patient-filter"
              className="focus-ring min-h-10 w-full rounded border border-[#D9DDE3] pl-10 pr-3 text-sm"
              placeholder="Name, patient ID, or mobile"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <label className="sr-only" htmlFor="branch-filter">
            Filter by branch
          </label>
          <select
            id="branch-filter"
            className="focus-ring min-h-10 rounded border border-[#D9DDE3] bg-white px-3 text-sm font-semibold"
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
          >
            <option value="all">All branches</option>
            {branches.map(([branchId, branchName]) => (
              <option key={branchId} value={branchId}>
                {branchName}
              </option>
            ))}
          </select>
          <div className="flex rounded border border-[#D9DDE3] bg-white p-1">
            <button
              className="focus-ring inline-flex min-h-9 w-9 items-center justify-center rounded text-[#481827] data-[active=true]:bg-[#F8F4ED]"
              type="button"
              data-active={view === "cards"}
              aria-label="Card view"
              onClick={() => setView("cards")}
            >
              <Grid2X2 size={17} aria-hidden />
            </button>
            <button
              className="focus-ring inline-flex min-h-9 w-9 items-center justify-center rounded text-[#481827] data-[active=true]:bg-[#F8F4ED]"
              type="button"
              data-active={view === "table"}
              aria-label="Table view"
              onClick={() => setView("table")}
            >
              <List size={17} aria-hidden />
            </button>
          </div>
        </div>
        {message ? <p className="mt-3 text-sm font-semibold text-[#28875B]">{message}</p> : null}
      </div>

      {view === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => (
            <article
              key={patient.id}
              className="rounded border border-[#D9DDE3] bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded bg-[#6F263D] font-serif text-lg font-semibold text-white">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-[#481827]">
                    {formatPatientName(patient)}
                  </h2>
                  <p className="text-sm font-semibold text-[#5F6368]">{patient.patientNumber}</p>
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${alertTone(patient.clinicalAlertLevel)}`}
                >
                  {patient.clinicalAlertLevel.replaceAll("_", " ")}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Sex" value={patient.sexAtBirth} />
                <Metric
                  label="Mobile"
                  value={revealed[patient.id]?.mobile ?? patient.maskedMobile}
                />
                <Metric
                  label="Last visit"
                  value={
                    patient.lastVisitAt
                      ? new Date(patient.lastVisitAt).toLocaleDateString()
                      : "None"
                  }
                />
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/patients/${patient.id}` as Route}
                  className="focus-ring inline-flex min-h-10 items-center rounded bg-[#6F263D] px-4 py-2 text-sm font-semibold text-white"
                >
                  View
                </Link>
                {canRevealContact ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => revealContact(patient.id)}
                  >
                    <Eye size={16} aria-hidden /> Reveal
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-[#D9DDE3] bg-white shadow-sm">
          <table className="w-full min-w-[880px] border-collapse text-left text-sm">
            <thead className="bg-[#F8F4ED] text-xs uppercase text-[#6F263D]">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Alert</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-t border-[#D9DDE3]">
                  <td className="px-4 py-3 font-semibold text-[#481827]">
                    {formatPatientName(patient)}
                  </td>
                  <td className="px-4 py-3">{patient.patientNumber}</td>
                  <td className="px-4 py-3">{patient.homeBranchName}</td>
                  <td className="px-4 py-3">
                    {revealed[patient.id]?.mobile ?? patient.maskedMobile}
                  </td>
                  <td className="px-4 py-3">{patient.clinicalAlertLevel.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3">
                    <Link
                      className="font-semibold text-[#6F263D]"
                      href={`/patients/${patient.id}` as Route}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-[#6F263D]">{label}</dt>
      <dd className="mt-1 font-semibold text-[#262626]">{value}</dd>
    </div>
  );
}
