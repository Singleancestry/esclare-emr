import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Stethoscope } from "lucide-react";
import { formatTreatmentPrice, treatments } from "@/lib/services/catalog";
import { getTreatmentDetail } from "@/lib/services/details";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return treatments
    .filter((treatment) => treatment.public)
    .map((treatment) => ({ slug: treatment.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const treatment = treatments.find((item) => item.slug === slug && item.public);
  if (!treatment) return {};
  return {
    title: treatment.name,
    description: `${treatment.summary} Learn what to expect, treatment timing, suitability, beforecare, aftercare, and consultation requirements.`,
    alternates: { canonical: `/treatments/${treatment.slug}` },
  };
}

export default async function TreatmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const treatment = treatments.find((item) => item.slug === slug && item.public);
  if (!treatment) notFound();
  const detail = getTreatmentDetail(treatment);

  return (
    <main>
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-14 sm:py-20">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
            <Link href="/home">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/treatments">Treatments</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">{treatment.name}</span>
          </nav>
          <div className="mt-9 grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
            <div>
              <p className="public-eyebrow">{treatment.category}</p>
              <h1 className="public-heading mt-4 max-w-5xl">{treatment.name}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62595C]">{treatment.summary}</p>
            </div>
            <div className="border-l border-[#B98A4D] pl-5">
              <p className="text-xs font-bold uppercase text-[#765A44]">Current listed price</p>
              <p className="mt-2 font-serif text-2xl text-[#481827]">
                {formatTreatmentPrice(treatment)}
              </p>
              {treatment.doctorRequired && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6F263D]">
                  <Stethoscope size={17} aria-hidden="true" /> Doctor consultation required
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="public-container grid gap-12 lg:grid-cols-[0.62fr_0.38fr] lg:gap-16">
          <div>
            <p className="public-eyebrow">How it works</p>
            <h2 className="public-subheading mt-4">A treatment plan built around assessment.</h2>
            <p className="mt-6 leading-8 text-[#62595C]">{detail.howItWorks}</p>
            <h3 className="mt-10 text-2xl text-[#481827]">Common concerns addressed</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {detail.concerns.map((concern) => (
                <p
                  key={concern}
                  className="flex gap-2 border-b border-[#D8C9B4] pb-3 text-sm text-[#62595C]"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-[#9A7740]"
                    size={16}
                    aria-hidden="true"
                  />{" "}
                  {concern}
                </p>
              ))}
            </div>
          </div>
          <aside className="h-fit bg-white p-6 shadow-[0_14px_34px_rgba(59,13,20,0.08)] sm:p-8">
            <Clock3 className="text-[#6F263D]" size={22} aria-hidden="true" />
            <h2 className="mt-4 text-2xl text-[#481827]">Treatment timing</h2>
            <p className="mt-4 text-sm leading-7 text-[#62595C]">{detail.duration}</p>
            <h3 className="mt-7 font-sans text-sm font-bold text-[#481827]">Session planning</h3>
            <p className="mt-3 text-sm leading-7 text-[#62595C]">{detail.sessions}</p>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#D8C9B4] bg-white py-14 sm:py-20">
        <div className="public-container grid gap-8 lg:grid-cols-2">
          <div>
            <p className="public-eyebrow">Potential benefits</p>
            <h2 className="mt-4 text-3xl text-[#481827]">Cautious, individualized expectations</h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-[#62595C]">
              {detail.potentialBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-[#6F263D]">{detail.expectedResults}</p>
          </div>
          <div>
            <p className="public-eyebrow">Suitability</p>
            <h2 className="mt-4 text-3xl text-[#481827]">Who may need clearance or another plan</h2>
            <p className="mt-5 text-sm leading-7 text-[#62595C]">{detail.suitableFor}</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#62595C]">
              {detail.medicalClearance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="public-container">
          <p className="public-eyebrow">Your appointment</p>
          <h2 className="mt-4 text-3xl text-[#481827]">What happens during the visit</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              "Consultation",
              "Area preparation",
              "Treatment",
              "Immediate care",
              "Aftercare review",
              "Follow-up plan",
            ].map((step, index) => (
              <li key={step} className="border-t border-[#B98A4D] pt-4 text-sm text-[#62595C]">
                <span className="mb-2 block text-xs font-bold text-[#6F263D]">0{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div>
              <h3 className="text-2xl text-[#481827]">Beforecare</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#62595C]">
                {detail.beforecare.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl text-[#481827]">Aftercare</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#62595C]">
                {detail.aftercare.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl text-[#481827]">Downtime and recovery</h3>
              <p className="mt-4 text-sm leading-7 text-[#62595C]">{detail.downtime}</p>
              <p className="mt-4 text-sm leading-7 text-[#6F263D]">
                Contact the clinic for severe pain, blistering, marked swelling, signs of infection,
                or a reaction that continues to worsen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-[#D8C9B4] bg-white py-14"
        aria-labelledby="treatment-faq-heading"
      >
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow">Questions before treatment</p>
          <h2 id="treatment-faq-heading" className="mt-4 text-3xl text-[#481827]">
            Frequently asked questions
          </h2>
          <div className="mt-7 divide-y divide-[#D8C9B4] border-y border-[#D8C9B4]">
            {detail.faqs.map((faq) => (
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

      <section className="bg-[#3B0D14] py-14 text-white">
        <div className="public-container flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B078]">
              Naga or Daet
            </p>
            <h2 className="mt-3 text-3xl">Ask whether this treatment is right for you.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E6D6CC]">
              Submit your preferred date and time. ESCLARE confirms availability after review.
            </p>
          </div>
          <Link
            href={`/appointment-request?treatment=${treatment.slug}`}
            className="luxury-button-light shrink-0"
          >
            <CalendarDays size={17} aria-hidden="true" /> Request assessment{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
