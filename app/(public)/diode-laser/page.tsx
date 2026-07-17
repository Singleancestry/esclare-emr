import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Snowflake, Waves } from "lucide-react";
import { diodeMachine } from "@/lib/clinic/media";

export const metadata: Metadata = {
  title: "4D Diode Laser Hair Reduction",
  description:
    "Learn about ESCLARE's four-wavelength diode laser hair-reduction service, session guidance, treatment areas, and package menu.",
  alternates: { canonical: "/diode-laser" },
};
const areas = [
  "Face and upper lip",
  "Underarms",
  "Arms and legs",
  "Back and chest",
  "Bikini line and Brazilian",
  "Navel and other eligible areas",
];
export default function DiodeLaserPage() {
  return (
    <main>
      <section className="overflow-hidden bg-[#32101E] text-white">
        <div className="public-container grid min-h-[70svh] items-center gap-10 py-16 lg:grid-cols-[1fr_0.8fr] lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4B77D]">
              4-wavelength laser hair reduction
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.98] sm:text-7xl">
              Smoother routines, thoughtfully planned.
            </h1>
            <p className="mt-6 max-w-2xl leading-8 text-[#E7DAD2]">
              A non-invasive hair-reduction service using a four-wavelength diode platform with
              cooling support. Treatment settings, intervals, and the number of sessions are
              tailored after assessment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/appointment-request" className="luxury-button-light">
                <CalendarDays size={17} /> Request assessment
              </Link>
              <Link href="/treatments#4d-diode-packages" className="luxury-button-ghost">
                View packages <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[9/11] bg-[#FBF8F2]">
            <Image
              src={diodeMachine.src}
              alt={diodeMachine.alt}
              width={diodeMachine.width}
              height={diodeMachine.height}
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="size-full object-contain p-7 sm:p-12"
            />
            <p className="absolute bottom-4 left-4 bg-[#5B1830] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#E8D5B5]">
              4D diode technology
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 lg:py-28">
        <div className="public-container grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
          <div data-reveal>
            <p className="public-eyebrow">How it works</p>
            <h2 className="public-subheading mt-4">Coverage across different follicle depths.</h2>
          </div>
          <div data-reveal="right">
            <p className="leading-8 text-[#62595C]">
              The system directs laser energy toward pigment in the hair shaft and follicle. Because
              hair grows in cycles, a series of properly spaced sessions is commonly recommended
              rather than a single visit.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <Waves className="mt-1 shrink-0 text-[#9A7740]" size={21} />
                <div>
                  <h3 className="font-sans text-sm font-bold text-[#3A2029]">Four wavelengths</h3>
                  <p className="mt-1 text-sm leading-6 text-[#6B6264]">
                    Designed for broader coverage across hair depths and thicknesses.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Snowflake className="mt-1 shrink-0 text-[#9A7740]" size={21} />
                <div>
                  <h3 className="font-sans text-sm font-bold text-[#3A2029]">Cooling support</h3>
                  <p className="mt-1 text-sm leading-6 text-[#6B6264]">
                    Supports comfort during treatment, with sensation varying by area and
                    sensitivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#EEE6DA] py-20">
        <div className="public-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="public-eyebrow">Treatment areas</p>
            <h2 className="public-subheading mt-4">Flexible coverage, professional assessment.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {areas.map((area) => (
                <p
                  key={area}
                  className="flex items-center gap-2 border-b border-[#CFC0AB] pb-3 text-sm text-[#4F4448]"
                >
                  <CheckCircle2 className="shrink-0 text-[#9A7740]" size={16} /> {area}
                </p>
              ))}
            </div>
          </div>
          <div className="border-l border-[#C4A064] pl-6 sm:pl-10">
            <p className="public-eyebrow">Session guidance</p>
            <h2 className="mt-4 text-3xl text-[#481827]">Consistency matters.</h2>
            <p className="mt-5 text-sm leading-7 text-[#62595C]">
              At least eight sessions are commonly recommended, often around four weeks apart. Some
              clients need more sessions, and maintenance may be advised depending on hormones, hair
              density, treatment area, and consistency.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#62595C]">
              Results vary. ESCLARE does not promise complete or permanent removal for every client,
              and the treatment is not recommended during pregnancy.
            </p>
            <Link href="/treatments#4d-diode-packages" className="luxury-button mt-7">
              View package prices <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow">Before and after</p>
          <div className="mt-7 grid gap-7 sm:grid-cols-2">
            <div>
              <h2 className="font-sans text-base font-bold text-[#481827]">Before your session</h2>
              <p className="mt-3 text-sm leading-7 text-[#62595C]">
                Shave the area 12-24 hours beforehand when possible. Avoid waxing, plucking,
                threading, strong exfoliants, and irritating products before the appointment.
              </p>
            </div>
            <div>
              <h2 className="font-sans text-base font-bold text-[#481827]">After your session</h2>
              <p className="mt-3 text-sm leading-7 text-[#62595C]">
                Follow the team&apos;s instructions, keep the area comfortable, and temporarily
                avoid heat, heavy friction, and irritating products. Mild warmth or redness can
                occur.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
