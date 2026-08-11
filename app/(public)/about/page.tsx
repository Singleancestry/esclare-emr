import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { AttendantSection } from "@/components/public/attendant-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ESCLARE's warm, assessment-led approach to aesthetic and wellness care in Naga and Daet.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <main>
      <section className="bg-[#32101E] py-16 text-white sm:py-24">
        <div className="public-container">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8D5B5]">
            About ESCLARE
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">
            A warmer, more considered standard of aesthetic care.
          </h1>
          <p className="mt-6 max-w-2xl leading-8 text-[#E7DAD2]">
            ESCLARE brings premium treatments and approachable guidance together in welcoming
            clinics across Naga and Daet.
          </p>
        </div>
      </section>
      <section className="py-20 lg:py-28">
        <div className="public-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="public-eyebrow">Our approach</p>
            <h2 className="public-subheading mt-4">
              Beautiful outcomes begin with honest conversations.
            </h2>
            <p className="mt-6 leading-8 text-[#62595C]">
              Esclare Aesthetic Center began on August 8, 2012, in Naga City, Philippines. Before
              opening ESCLARE, the founder gained experience with a world-class aesthetic clinic in
              Qatar and trained with a Korean aesthetic clinic in Metro Manila.
            </p>
            <p className="mt-5 leading-8 text-[#62595C]">
              ESCLARE was created to bring a high-quality, world-class aesthetic clinic experience
              closer to the local community. Today, that purpose is reflected in warm hospitality,
              honest conversations, careful assessment, realistic expectations, and thoughtful
              follow-up for every patient.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden" data-reveal="right">
            <Image
              src="/images/optimized/clinic/esclare-naga-waiting-area-v2.webp"
              alt="The authentic ESCLARE Naga waiting area and crystal chandelier"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="public-container">
          <div className="grid gap-px bg-[#D8C9B4] md:grid-cols-3">
            {[
              [
                ShieldCheck,
                "Safety before trends",
                "We make room for assessment, contraindications, and the right clinical pathway.",
              ],
              [
                HeartHandshake,
                "Warm hospitality",
                "Premium care can be polished without feeling intimidating or impersonal.",
              ],
              [
                Sparkles,
                "Clear expectations",
                "We use careful language, transparent regular pricing, and no guaranteed-result claims.",
              ],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon;
              return (
                <article key={String(title)} className="bg-[#FBF8F2] p-7" data-reveal>
                  <FeatureIcon className="text-[#9A7740]" size={23} />
                  <h2 className="mt-8 text-2xl text-[#481827]">{String(title)}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#676064]">{String(copy)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#F4E8DA] py-20 lg:py-28" aria-labelledby="our-team-heading">
        <div className="public-container">
          <div className="max-w-3xl" data-reveal>
            <p className="public-eyebrow">Our team</p>
            <h2 id="our-team-heading" className="public-subheading mt-4">
              Coordinated care, with every role clearly defined.
            </h2>
            <p className="mt-5 leading-8 text-[#62595C]">
              Our team works together around patient comfort, treatment readiness, clear clinical
              boundaries, and continuity of care.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              [
                "Resident Nurse",
                "Supports daily clinical operations, treatment preparation, and appropriate patient monitoring before, during, and after treatment. The resident nurse also supports aftercare and continuity of care within their professional scope.",
              ],
              [
                "Aesthetic Clinic Attendants",
                "Support and perform appropriate non-physician aesthetic treatments according to clinic protocols and permitted scope. They assist patients throughout the visit, maintain treatment areas and readiness, and help create a smooth, comfortable experience.",
              ],
              [
                "Resident Aesthetic Doctor",
                "Conducts medical and aesthetic consultations, assesses patients, and develops individualized plans where medically appropriate. The doctor performs physician-required procedures and provides medical oversight of clinical standards and clinic operations.",
              ],
            ].map(([title, copy]) => (
              <article key={title} className="editorial-card p-7" data-reveal>
                <h3 className="font-serif text-2xl text-[#59141D]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#62595C]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <AttendantSection />
      <section className="bg-[#EEE6DA] py-14">
        <div className="public-container text-center">
          <h2 className="text-3xl text-[#481827]">Ready to begin with a conversation?</h2>
          <Link href="/appointment-request" className="luxury-button mt-6">
            Request a visit <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
