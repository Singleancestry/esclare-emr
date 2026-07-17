import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "ESCLARE public website privacy notice.",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-[#EEE6DA] py-16">
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow">Legal</p>
          <h1 className="public-heading mt-4">Privacy notice</h1>
          <p className="mt-5 text-sm text-[#6B6264]">Effective July 2026</p>
        </div>
      </section>
      <article className="public-container max-w-4xl space-y-9 py-16 text-sm leading-7 text-[#5F575A]">
        <section>
          <h2 className="text-2xl text-[#481827]">Information we receive</h2>
          <p className="mt-3">
            The public appointment tool requires only your full name. Branch, treatment, date, and
            time selections are optional. When you continue through Facebook, phone, SMS, or email,
            that provider and ESCLARE receive the information you choose to send.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">How information is used</h2>
          <p className="mt-3">
            Information is used to respond to inquiries, check appointment availability, prepare
            clinic services, and meet legal or safety obligations. Public booking information is not
            used as a substitute for clinical assessment.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Sensitive information</h2>
          <p className="mt-3">
            Do not send medical records, payment-card details, passwords, or clinical photographs
            through the public website. Sensitive clinical information belongs in ESCLARE’s
            protected clinic systems and approved workflows.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Your choices</h2>
          <p className="mt-3">
            You may ask ESCLARE about your personal information, request corrections, or raise a
            privacy concern by emailing esclarenaga@gmail.com or contacting your branch.
          </p>
        </section>
      </article>
    </main>
  );
}
