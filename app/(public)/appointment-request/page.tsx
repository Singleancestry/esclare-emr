import Link from "next/link";

export default function AppointmentRequestPage() {
  return (
    <main className="min-h-screen bg-[#F8F4ED] px-6 py-10 text-[#262626]">
      <section className="mx-auto max-w-2xl rounded border border-[#D9DDE3] bg-white p-8 shadow-sm">
        <Link href="/home" className="font-serif text-2xl font-semibold text-[#6F263D]">
          ESCLARE
        </Link>
        <h1 className="mt-8 text-4xl font-semibold text-[#481827]">Appointment Request</h1>
        <p className="mt-4 leading-7 text-[#5F6368]">
          Public booking begins as a request and is never automatically confirmed. The full request
          workflow is scheduled for Phase 8.
        </p>
      </section>
    </main>
  );
}
