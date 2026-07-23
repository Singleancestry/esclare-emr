import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ClipboardCheck, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import { Glp1HeroMedia } from "@/components/public/glp1-hero-media";
import { glp1Content } from "@/lib/content/glp1";

export const metadata: Metadata = {
  title: "Physician-Supervised GLP-1 Weight Management",
  description:
    "Learn about ESCLARE's physician-supervised GLP-1 weight-management consultation and 4-week treatment program in Naga and Daet.",
  alternates: { canonical: "/glp-1-slimming" },
  openGraph: {
    title: "GLP-1 Slimming Program | ESCLARE",
    description:
      "A medically guided approach to sustainable weight management, with eligibility determined through consultation and clinical assessment.",
    images: [
      {
        url: "/images/optimized/glp-1/glp-1-hero-poster.webp",
        width: 1920,
        height: 1080,
        alt: "ESCLARE GLP-1 Slimming Program",
      },
    ],
  },
};

const steps = [
  [
    ClipboardCheck,
    "Clinical assessment",
    "Health history, current medicines, goals, and relevant risks are reviewed.",
  ],
  [
    Stethoscope,
    "Individual selection",
    "A qualified prescriber determines whether treatment and a specific medicine are appropriate.",
  ],
  [
    Activity,
    "Ongoing monitoring",
    "Progress, tolerability, side effects, and continuation are reviewed clinically.",
  ],
] as const;

export default function Glp1SlimmingPage() {
  return (
    <main>
      <section className="glp1-hero" aria-labelledby="glp1-page-title">
        <div className="sr-only">
          <h1 id="glp1-page-title">GLP-1 Slimming Program</h1>
          <p>A medically guided approach to sustainable weight management.</p>
          <p>{glp1Content.programLabel}</p>
        </div>
        <Glp1HeroMedia />
      </section>

      <section className="border-y border-[#D8C9B4] bg-[#FBF7F1] py-8">
        <div className="public-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-serif text-2xl text-[#59141D]">{glp1Content.programLabel}</p>
          <p className="max-w-xl text-sm leading-6 text-[#675D5F]">
            Eligibility, medication selection, and continuation depend on consultation and
            assessment by a qualified medical professional.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="public-container grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
          <div>
            <p className="public-eyebrow">Medical weight management</p>
            <h2 className="public-subheading mt-4">
              Care begins with suitability, not a prescription.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-[#62595C]">
            <p>{glp1Content.introduction}</p>
            <p>{glp1Content.program}</p>
            <p>{glp1Content.screening}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#D8C9B4] bg-white py-16 sm:py-20">
        <div className="public-container">
          <p className="public-eyebrow">The supervised pathway</p>
          <h2 className="public-subheading mt-4 max-w-3xl">
            A considered four-week starting program.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-[#D8C9B4] bg-[#D8C9B4] md:grid-cols-3">
            {steps.map(([Icon, title, copy]) => (
              <article key={title} className="bg-[#FBF8F2] p-7 sm:p-9">
                <Icon size={23} className="text-[#9A7740]" aria-hidden="true" />
                <h3 className="mt-6 text-2xl text-[#481827]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#62595C]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="public-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <article className="border-t border-[#B98A4D] pt-7">
            <HeartPulse className="text-[#6F263D]" size={24} aria-hidden="true" />
            <h2 className="mt-5 text-3xl text-[#481827]">Expectations and follow-up</h2>
            <p className="mt-5 leading-8 text-[#62595C]">{glp1Content.expectations}</p>
          </article>
          <article className="border-t border-[#B98A4D] pt-7">
            <ShieldCheck className="text-[#6F263D]" size={24} aria-hidden="true" />
            <h2 className="mt-5 text-3xl text-[#481827]">Lifestyle remains foundational</h2>
            <p className="mt-5 leading-8 text-[#62595C]">{glp1Content.lifestyle}</p>
          </article>
        </div>
      </section>

      <section
        className="border-y border-[#D8C9B4] bg-white py-16 sm:py-20"
        aria-labelledby="glp1-faq-title"
      >
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow">Before your consultation</p>
          <h2 id="glp1-faq-title" className="public-subheading mt-4">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-[#D8C9B4] border-y border-[#D8C9B4]">
            {glp1Content.faqs.map((faq) => (
              <details key={faq.question} className="py-4">
                <summary className="min-h-11 cursor-pointer content-center font-semibold text-[#481827] marker:text-[#B98A4D]">
                  {faq.question}
                </summary>
                <p className="pb-3 pr-5 text-sm leading-7 text-[#62595C]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#3B0D14] py-12 text-white">
        <div className="public-container">
          <p className="max-w-4xl text-sm leading-7 text-[#E6D6CC]">
            This page provides general educational information and is not a substitute for
            professional medical advice, diagnosis, or treatment. Results vary. Seek immediate
            professional or emergency assistance for urgent or severe symptoms.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#E2BF83]">
            <Link href="/appointment-request?treatment=glp-1-slimming">
              Request a medical assessment
            </Link>
            <Link href="/contact">Contact ESCLARE</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
