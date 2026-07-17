import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Website Terms",
  description: "Terms for using the ESCLARE public website and appointment request service.",
  alternates: { canonical: "/terms" },
};
export default function TermsPage() {
  return (
    <main>
      <section className="bg-[#EEE6DA] py-16">
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow">Legal</p>
          <h1 className="public-heading mt-4">Website terms</h1>
          <p className="mt-5 text-sm text-[#6B6264]">Effective July 2026</p>
        </div>
      </section>
      <article className="public-container max-w-4xl space-y-9 py-16 text-sm leading-7 text-[#5F575A]">
        <section>
          <h2 className="text-2xl text-[#481827]">General information</h2>
          <p className="mt-3">
            Website content is provided for general information and appointment planning. It does
            not provide diagnosis, medical advice, or a guarantee that a treatment is suitable for
            you.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Appointments</h2>
          <p className="mt-3">
            Submitting or preparing a request does not confirm a booking. ESCLARE confirms
            availability through Facebook, phone call, or SMS. No booking deposit is required.
            Please give at least 2 hours notice for cancellation or rescheduling.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Prices and results</h2>
          <p className="mt-3">
            Displayed prices are regular reference rates as of the stated effective date and may
            change after management review. Final recommendations and costs can depend on
            assessment, treatment area, or clinical requirements. Results vary and are not
            guaranteed.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Acceptable use</h2>
          <p className="mt-3">
            Do not misuse the website, attempt unauthorized access, submit unlawful content, or
            interfere with clinic systems. Staff access is restricted to authorized users.
          </p>
        </section>
      </article>
    </main>
  );
}
