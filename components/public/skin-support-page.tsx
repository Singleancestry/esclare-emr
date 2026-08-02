import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { AlertTriangle, ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import type { Treatment } from "@/lib/services/catalog";
import { formatTreatmentPrice } from "@/lib/services/catalog";
import type { SkinSupportContent } from "@/lib/services/skin-support";

export function SkinSupportPage({
  treatment,
  content,
}: {
  treatment: Treatment;
  content: SkinSupportContent;
}) {
  const quickFacts = [
    ["Classification", content.classification],
    ["Assessment", content.assessment],
    ["Branches", content.branches],
    ["Frequency", content.frequency ?? "Not published until verified"],
    ["Duration", content.duration ?? "Confirmed after protocol review"],
    ["Downtime", content.downtime ?? "Not published until verified"],
  ] as const;

  return (
    <main>
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-12 sm:py-16">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/treatments">Treatments</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/treatments/skin-support">Skin Support</Link>{" "}
            <span aria-hidden="true">/</span> <span aria-current="page">{treatment.name}</span>
          </nav>
          <div className="mt-8 grid gap-9 lg:grid-cols-[0.56fr_0.44fr] lg:items-center">
            <div>
              <p className="public-eyebrow">Skin Support</p>
              <h1 className="public-heading mt-4">{treatment.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#62595C]">
                {content.positioning}
              </p>
              <p className="mt-6 font-serif text-2xl text-[#59141D]">
                {formatTreatmentPrice(treatment)}
              </p>
              <div className="mt-7 border-l-2 border-[#A34B5B] bg-white/70 px-5 py-4 text-sm leading-6 text-[#59141D]">
                <p className="flex gap-3">
                  <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />{" "}
                  {content.reviewNotice}
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#E8D7CA]">
              <Image
                src={content.image}
                alt={content.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8C9B4] bg-white py-10">
        <div className="public-container grid gap-px bg-[#D8C9B4] sm:grid-cols-2 lg:grid-cols-3">
          {quickFacts.map(([label, value]) => (
            <div key={label} className="bg-white p-5">
              <p className="text-xs font-bold uppercase text-[#765A44]">{label}</p>
              <p className="mt-2 text-sm leading-6 text-[#481827]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="public-container grid gap-12 lg:grid-cols-[0.62fr_0.38fr] lg:gap-16">
          <div>
            <p className="public-eyebrow">What it is</p>
            <h2 className="public-subheading mt-4">
              Clear information before treatment decisions.
            </h2>
            {content.overview.map((paragraph) => (
              <p key={paragraph} className="mt-5 leading-8 text-[#62595C]">
                {paragraph}
              </p>
            ))}
            <h3 className="mt-10 text-2xl text-[#481827]">
              What makes the proposed service distinct
            </h3>
            <p className="mt-4 leading-8 text-[#62595C]">{content.unique}</p>
          </div>
          <aside className="h-fit border border-[#D8C9B4] bg-white p-6 sm:p-8">
            <ShieldCheck className="text-[#6F263D]" size={24} aria-hidden="true" />
            <h2 className="mt-4 text-2xl text-[#481827]">Safety and regulatory status</h2>
            <p className="mt-4 text-sm leading-7 text-[#62595C]">{content.regulatory}</p>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#D8C9B4] bg-white py-14 sm:py-20">
        <div className="public-container">
          <p className="public-eyebrow">Treatment process</p>
          <h2 className="public-subheading mt-4">A controlled, assessment-led sequence.</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.process.map((step, index) => (
              <li
                key={step}
                className="border-t border-[#B98A4D] pt-4 text-sm leading-7 text-[#62595C]"
              >
                <span className="mb-2 block text-xs font-bold text-[#6F263D]">0{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-10 border-l border-[#B98A4D] pl-5">
            <h3 className="text-2xl text-[#481827]">Treatment plan</h3>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[#62595C]">{content.plan}</p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="public-container grid gap-10 lg:grid-cols-3">
          <div>
            <p className="public-eyebrow">Potential benefits</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#62595C]">
              {content.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-[#9A7740]"
                    size={16}
                    aria-hidden="true"
                  />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="public-eyebrow">Suitability</p>
            <p className="mt-5 text-sm leading-7 text-[#62595C]">{content.candidates}</p>
          </div>
          <div>
            <p className="public-eyebrow">Expected results</p>
            <p className="mt-5 text-sm leading-7 text-[#62595C]">{content.expectations}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#D8C9B4] bg-white py-14 sm:py-20">
        <div className="public-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="public-eyebrow">Aftercare</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#62595C]">
              {content.aftercare.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="public-eyebrow">Safety notes</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#62595C]">
              {content.safety.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow">Useful questions</p>
          <h2 className="public-subheading mt-4">Frequently asked questions</h2>
          <div className="mt-7 divide-y divide-[#D8C9B4] border-y border-[#D8C9B4]">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="py-4">
                <summary className="min-h-11 cursor-pointer content-center font-semibold text-[#481827] marker:text-[#B98A4D]">
                  {faq.question}
                </summary>
                <p className="pb-3 pr-5 text-sm leading-7 text-[#62595C]">{faq.answer}</p>
              </details>
            ))}
          </div>
          <Link
            href={content.relatedEducation.href as Route}
            className="public-link mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-[#59141D]"
          >
            {content.relatedEducation.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="border-y border-[#D8C9B4] bg-[#F4E8DA] py-14 sm:py-20">
        <div className="public-container">
          <p className="public-eyebrow">Continue browsing</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="public-subheading">Related Skin Support products</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#62595C]">
                Compare the MCCM and Rejuran groups while keeping each product&apos;s review status
                and route distinct.
              </p>
            </div>
            <Link
              href="/treatments/skin-support"
              className="public-link inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-[#59141D]"
            >
              View Skin Support collection <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#3B0D14] py-14 text-white">
        <div className="public-container flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-[#D6B078]">Review status</p>
            <h2 className="mt-3 text-3xl">This service is not open for booking.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E6D6CC]">
              {content.bookingNote} A submitted appointment request is never an automatic
              confirmation.
            </p>
          </div>
          <Link href="/contact" className="luxury-button-light shrink-0">
            <MapPin size={17} aria-hidden="true" /> Ask the clinic{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
