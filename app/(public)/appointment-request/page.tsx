import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { AppointmentRequestForm } from "@/components/public/appointment-request-form";
import { treatments } from "@/lib/services/catalog";

export const metadata: Metadata = {
  title: "Request an Appointment",
  description:
    "Prepare an appointment request for ESCLARE Naga or Daet. No booking deposit required.",
  alternates: { canonical: "/appointment-request" },
};
export default async function AppointmentRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; treatment?: string }>;
}) {
  const { branch, treatment } = await searchParams;
  const initialBranch = branch === "daet" ? "daet" : "naga";
  const initialTreatment =
    typeof treatment === "string" && treatments.some((item) => item.slug === treatment)
      ? treatment
      : "";
  return (
    <main>
      <section className="bg-[#32101E] py-14 text-white sm:py-20">
        <div className="public-container">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8D5B5]">
            Simple, direct booking
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">
            Request your ESCLARE visit.
          </h1>
          <p className="mt-5 max-w-2xl leading-8 text-[#E7DAD2]">
            Share your preferred details, then continue through an official branch channel. Your
            appointment is confirmed only after the team replies.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#F1E6DE]">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="text-[#D4B77D]" size={16} /> Full name only required
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="text-[#D4B77D]" size={16} /> No deposit
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="text-[#D4B77D]" size={16} /> No automatic confirmation
            </span>
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="public-container">
          <AppointmentRequestForm
            initialBranch={initialBranch}
            initialTreatment={initialTreatment}
          />
        </div>
      </section>
      <section className="border-t border-[#D8C9B4] bg-[#EEE6DA] py-12">
        <div className="public-container grid gap-8 sm:grid-cols-3">
          <div>
            <p className="public-eyebrow">Changes</p>
            <h2 className="mt-2 font-sans text-base font-bold text-[#481827]">2 hours notice</h2>
            <p className="mt-2 text-sm leading-6 text-[#62595C]">
              Cancel or reschedule at least 2 hours before your appointment.
            </p>
          </div>
          <div>
            <p className="public-eyebrow">Late arrival</p>
            <h2 className="mt-2 font-sans text-base font-bold text-[#481827]">
              Based on availability
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#62595C]">
              Late clients are accommodated when the schedule allows.
            </p>
          </div>
          <div>
            <p className="public-eyebrow">No-show</p>
            <h2 className="mt-2 font-sans text-base font-bold text-[#481827]">
              You may book again
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#62595C]">
              There is no restriction on requesting another appointment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
