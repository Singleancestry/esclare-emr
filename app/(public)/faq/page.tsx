import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";
import { FaqBrowser } from "@/components/public/faq-browser";
import { clinicFaqs } from "@/lib/clinic/faqs";

export const metadata: Metadata = {
  title: "Aesthetic Clinic FAQ | Laser, Facials & HIFU in Naga and Daet",
  description:
    "Find answers about diode laser hair removal, underarm whitening, acne facials, HIFU, skin boosters, Botox and weight management at Esclare clinics in Naga City and Daet.",
  alternates: { canonical: "/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: clinicFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replaceAll("<", "\\u003c") }}
      />
      <section className="bg-[#EEE6DA] py-16 sm:py-24">
        <div className="public-container">
          <p className="public-eyebrow">Clear guidance</p>
          <h1 className="public-heading mt-4 max-w-4xl">
            Aesthetic treatment questions, answered honestly.
          </h1>
          <p className="mt-6 max-w-2xl leading-8 text-[#62595C]">
            Understand common treatment limits, booking rules and aftercare before visiting ESCLARE
            in Naga or Daet. Personal medical advice still requires an assessment.
          </p>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="public-container max-w-5xl">
          <FaqBrowser />
        </div>
      </section>
      <section className="bg-[#5B1830] py-14 text-white">
        <div className="public-container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E8D5B5]">
              Need personal guidance?
            </p>
            <h2 className="mt-3 text-3xl">Request an assessment with ESCLARE.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E8D9CF]">
              Appointment requests remain pending until the branch confirms staff, doctor, room and
              device availability.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/appointment-request" className="luxury-button-light">
              <CalendarDays size={17} aria-hidden="true" /> Request appointment
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/35 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <MessageCircle size={17} aria-hidden="true" /> Contact a branch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
