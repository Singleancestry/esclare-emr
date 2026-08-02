import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PrintTermsButton } from "@/components/public/print-terms-button";

export const metadata: Metadata = {
  title: "Treatment Package Terms and Conditions",
  description:
    "Review ESCLARE treatment-package pricing, validity, booking, refund, safety, consumer-rights, and acknowledgment terms.",
  alternates: { canonical: "/package-terms" },
};

const sections = [
  {
    title: "1. Treatment packages",
    paragraphs: [
      "Treatment packages are promotional offers provided at discounted rates compared with the clinic's regular per-session prices. A package price is a total promotional amount and does not represent the regular price of each individual session.",
      "Before purchase, ESCLARE must disclose the package name, inclusions, number of sessions, total price, regular per-session price, validity period, branch, and important booking conditions. Those package-specific details must be retained with the policy version accepted by the client.",
    ],
  },
  {
    title: "2. Package validity",
    paragraphs: [
      "Every package has a defined validity period disclosed at purchase. The client is responsible for scheduling and completing sessions within that period. Unused sessions may be forfeited after expiry unless ESCLARE approves a written extension.",
      "An approved extension must record the reason, approving staff member, approval date, new expiry date, and internal notes. The client should be able to see the expiry date wherever the current system supports it.",
    ],
  },
  {
    title: "3. Appointments, rescheduling, no-shows, and late cancellations",
    paragraphs: [
      "Treatments are by appointment and should be requested in advance, subject to availability. A requested or pending time is not confirmed until ESCLARE replies through an official channel.",
      "ESCLARE may reschedule because of emergencies, staff or doctor availability, equipment maintenance, power interruption, safety concerns, or circumstances beyond reasonable control. The nearest reasonable available schedule should be offered.",
      "Clients must provide the disclosed notice before cancelling or rescheduling. Repeated no-shows or late cancellations may lead to session forfeiture or a reasonable rescheduling fee only when that exact rule was properly disclosed before purchase or booking. ESCLARE must not impose an undisclosed fee or forfeiture. Any staff override requires a recorded reason.",
    ],
  },
  {
    title: "4. General refund policy",
    paragraphs: [
      "Promotional or discounted packages are generally non-refundable for reasons not caused by ESCLARE, including change of mind, lack of time, schedule conflicts, travel or relocation, missed appointments, failure to complete sessions within validity, dissatisfaction based on unrealistic expectations, or a personal decision to discontinue.",
      "A client's inability or unwillingness to continue does not automatically create a right to a refund. This rule must not be applied in a way that removes rights or remedies granted under applicable Philippine law.",
    ],
  },
  {
    title: "5. When ESCLARE cannot provide the purchased service",
    paragraphs: [
      "When ESCLARE cannot provide the purchased service for reasons directly attributable to the clinic and no reasonable alternative service, schedule, extension, or replacement can be offered, a refund may be considered after verification, supporting documents, management review, and applicable consumer-law review.",
      "Used sessions are valued at the regular per-session price, not the discounted package rate. The calculation may also deduct the disclosed value of complimentary treatments, free sessions, products, vouchers, discounts, promotional benefits already received, and only lawful, previously disclosed administrative or payment-processing charges.",
      "The preliminary balance is amount paid minus the regular value of used sessions and lawful deductions. It cannot exceed the amount paid and cannot fall below PHP 0. A calculation is an administrative aid and never automatically approves or issues a refund.",
    ],
  },
  {
    title: "6. Alternative remedies",
    paragraphs: [
      "Before a cash refund, authorized management may consider rescheduling remaining sessions, freezing the package, extending validity, transferring remaining sessions subject to approval, converting to a suitable treatment of equivalent value, or replacing a service the clinic cannot provide.",
      "No alternative remedy is guaranteed. The selected remedy, reason, approval, dates, value, and responsible staff member must be recorded.",
    ],
  },
  {
    title: "7. Medical conditions and pregnancy",
    paragraphs: [
      "Clients must disclose relevant medical conditions, allergies, medicines, pregnancy, possible pregnancy, and other health concerns. ESCLARE may require medical clearance.",
      "Depending on the condition and treatment, ESCLARE may extend or freeze a package, postpone treatment, recommend another suitable service, offer another reasonable arrangement, or refuse treatment where proceeding creates a safety risk. A medical condition does not automatically guarantee a cash refund.",
    ],
  },
  {
    title: "8. Treatment suitability and medical assessment",
    paragraphs: [
      "Package purchase does not guarantee clinical suitability for every included service. Assessment, consent, contraindication review, and doctor involvement remain required where applicable. Clinical judgment and applicable law take priority over promotional wording.",
    ],
  },
  {
    title: "9. Suspension or refusal for safety reasons",
    paragraphs: [
      "ESCLARE may pause, postpone, modify, or refuse treatment when a qualified provider identifies a health, safety, consent, product, equipment, or professional-scope concern. The reason and any proposed next step should be explained and documented where appropriate.",
    ],
  },
  {
    title: "10. Treatment results",
    paragraphs: [
      "Results vary between clients and may depend on skin type, hair type, age, hormones, medical conditions, lifestyle, treatment response, adherence to instructions, and other factors. ESCLARE does not guarantee identical, permanent, or specific results unless a lawful, express written guarantee applies.",
      "Recommended session counts are estimates, and additional sessions may be needed. No website, advertisement, structured data, FAQ, chatbot response, or booking message should contradict this limitation.",
    ],
  },
  {
    title: "11. Client responsibilities",
    paragraphs: [
      "Clients must provide complete and truthful medical and personal information; report allergies, medicines, pregnancy, medical conditions, and relevant changes; follow beforecare and aftercare; attend on time; give early rescheduling notice; complete sessions within validity; and promptly report unusual reactions or concerns.",
    ],
  },
  {
    title: "12. Promotions and discounts",
    paragraphs: [
      "Packages cannot be combined with other discounts, promotions, vouchers, or special offers unless ESCLARE expressly approves the combination. Senior-citizen and person-with-disability discounts must be handled under applicable Philippine law and documentation requirements. Promotion-specific exceptions must be recorded.",
    ],
  },
  {
    title: "13. Changes to treatment plans",
    paragraphs: [
      "ESCLARE may recommend changes because of medical condition, treatment response, safety considerations, or professional assessment. A material change must be discussed with the client before proceeding and documented in the patient record where appropriate.",
    ],
  },
  {
    title: "14. Consumer rights",
    paragraphs: [
      "Nothing in these Terms and Conditions is intended to remove, restrict, or waive a right or remedy granted under applicable Philippine consumer-protection law. If a clause is unlawful or unenforceable, the remaining provisions continue to apply to the extent legally permitted.",
    ],
  },
  {
    title: "15. Acknowledgment and consent",
    paragraphs: [
      "Before a supported online or in-clinic package purchase is completed, the client must have reasonable access to these full terms and actively select an unticked acknowledgment. The acknowledgment must identify the package name, price, sessions, regular per-session price, validity, branch, and booking conditions.",
      "Acceptance records should preserve the policy version and effective date, acceptance timestamp, client and package identifiers, package facts, branch, acceptance method, staff witness where applicable, signature or electronic acknowledgment, and approved exceptions. Historical accepted versions must not be overwritten.",
    ],
  },
  {
    title: "16. Policy status and changes",
    paragraphs: [
      "Preview version 2026-07-29-DRAFT. This website version is awaiting owner and qualified Philippine legal review and is not represented as legal advice or a completed legal review.",
      "A material change requires a new version and effective date. Existing purchase records must retain the version accepted at purchase. ESCLARE should re-present changed terms only where legally and operationally appropriate.",
    ],
  },
] as const;

export default function PackageTermsPage() {
  return (
    <main className="bg-[#FCFAF6] print:bg-white">
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-12 sm:py-16 print:bg-white print:py-4">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44] print:hidden">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">Treatment Package Terms</span>
          </nav>
          <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between print:mt-0">
            <div>
              <p className="public-eyebrow">Preview policy · 2026-07-29-DRAFT</p>
              <h1 className="public-heading mt-4 max-w-5xl">
                Treatment Package Terms and Conditions
              </h1>
              <p className="mt-5 max-w-3xl leading-8 text-[#62595C]">
                Accessible policy text for ESCLARE package pricing, validity, booking, refunds,
                safety, consumer rights, and acknowledgment.
              </p>
            </div>
            <PrintTermsButton />
          </div>
        </div>
      </section>

      <section className="py-10 print:py-4">
        <div className="public-container max-w-5xl">
          <div className="border-l-2 border-[#A34B5B] bg-[#F8ECEC] p-5 text-sm leading-7 text-[#59141D] print:border print:bg-white">
            <p className="flex gap-3">
              <AlertTriangle className="mt-1 shrink-0" size={18} aria-hidden="true" /> This draft
              has not been reviewed by a qualified Philippine legal professional. Package purchase,
              consent storage, refund calculation, and EMR package records are not yet enabled
              online.
            </p>
          </div>
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section
                key={section.title}
                className="break-inside-avoid border-t border-[#D8C9B4] pt-7"
              >
                <h2 className="text-2xl text-[#481827]">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-8 text-[#62595C]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <section className="mt-12 break-inside-avoid border border-[#B98A4D] bg-white p-6 sm:p-8">
            <h2 className="text-2xl text-[#481827]">Package acknowledgment</h2>
            <p className="mt-4 text-sm leading-7 text-[#62595C]">
              I confirm that the package name, package price, number of sessions, regular
              per-session price, validity period, booking conditions, refund policy, and Treatment
              Package Terms and Conditions have been explained or made available to me. I have had
              the opportunity to ask questions, and I voluntarily agree to the applicable Terms and
              Conditions.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {[
                "Package purchased",
                "Number of sessions",
                "Package price",
                "Regular price per session",
                "Package validity period",
                "Branch",
                "Client name",
                "Client signature and date",
                "Authorized representative",
                "Representative signature and date",
              ].map((field) => (
                <div
                  key={field}
                  className="min-h-16 border-b border-[#765A44] pt-4 text-xs font-bold uppercase text-[#765A44]"
                >
                  {field}
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 flex gap-3 text-sm leading-7 text-[#62595C] print:hidden">
            <CheckCircle2 className="mt-1 shrink-0 text-[#6F263D]" size={17} aria-hidden="true" />
            <p>
              For a package question, contact the selected branch. A package is not purchased or
              reserved by viewing or printing this page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
