import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, MapPin, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { AttendantSection } from "@/components/public/attendant-section";
import { AuthenticHero } from "@/components/public/authentic-hero";
import { ClinicGallery } from "@/components/public/clinic-gallery";
import { PremiumCounters } from "@/components/public/premium-counters";
import { TreatmentGallery } from "@/components/public/treatment-gallery";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { diodeMachine } from "@/lib/clinic/media";
import { treatments } from "@/lib/services/catalog";

export const metadata: Metadata = {
  title: "Aesthetic & Wellness Clinic in Naga and Daet",
  description: "Discover thoughtful aesthetic and wellness care at ESCLARE Naga and Daet. Explore regular prices and request an appointment with no booking deposit.",
  alternates: { canonical: "/home" },
};

const featuredSlugs = ["korean-facial", "pico-glow-face", "7d-hifu-face", "mccm-pdrn"];

export default function PublicHomePage() {
  const featured = featuredSlugs.map((slug) => treatments.find((item) => item.slug === slug)!);

  return <main>
    <AuthenticHero />

    <section className="border-b border-[#E3D8C8] bg-white py-8 sm:py-10" aria-label="ESCLARE at a glance">
      <div className="public-container"><PremiumCounters /></div>
    </section>

    <section className="bg-[#FCFAF6] py-20 lg:py-32">
      <div className="public-container grid gap-12 lg:grid-cols-[0.44fr_0.56fr] lg:gap-24">
        <div data-reveal>
          <p className="public-eyebrow">The ESCLARE standard</p>
          <h2 className="public-subheading mt-5">Clinical clarity, with a more considered sense of care.</h2>
        </div>
        <div className="lg:pt-12" data-reveal="right">
          <p className="max-w-2xl font-serif text-2xl leading-relaxed text-[#3D2B31] sm:text-3xl">The best aesthetic experience does not begin with a trend. It begins with listening.</p>
          <p className="mt-6 max-w-2xl leading-8 text-[#686064]">Every visit is shaped around your goals, suitability, comfort, and a plan you can understand. Doctor-required services follow the appropriate clinical pathway, while regular prices remain clear before you decide.</p>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.08em] text-[#5B1830]"><span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-[#A17E48]" /> Assessment-led</span><span className="inline-flex items-center gap-2"><Check size={16} className="text-[#A17E48]" /> Clear regular pricing</span><span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-[#A17E48]" /> Realistic guidance</span></div>
        </div>
      </div>
    </section>

    <section className="border-y border-[#DCCDB9] bg-[#F1E9DE] py-20 lg:py-28">
      <div className="public-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div><p className="public-eyebrow">Selected treatments</p><h2 className="public-subheading mt-4">A concise edit of signature care.</h2></div>
          <Link href="/treatments" className="public-link inline-flex w-fit items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#5B1830]">Explore the full menu <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-12 border-t border-[#BFAF99]">
          {featured.map((item, index) => <Link href={`/treatments#${item.category.replaceAll(" ", "-").toLowerCase()}`} key={item.slug} className="group grid gap-4 border-b border-[#CFC1AE] py-7 transition-colors hover:bg-white/45 sm:grid-cols-[4rem_0.72fr_1.28fr_auto] sm:items-center sm:px-4">
            <span className="font-serif text-xl text-[#9B7947]">0{index + 1}</span>
            <h3 className="text-2xl text-[#421522] sm:text-3xl">{item.name}</h3>
            <p className="max-w-xl text-sm leading-7 text-[#655E60]">{item.summary}</p>
            <span className="grid size-11 place-items-center rounded-lg border border-[#A98C60] text-[#5B1830] transition-all group-hover:bg-[#5B1830] group-hover:text-white"><ArrowRight size={17} /></span>
          </Link>)}
        </div>
      </div>
    </section>

    <TreatmentGallery />

    <section className="overflow-hidden bg-[#270B17] text-white">
      <div className="public-container grid min-h-[720px] items-stretch lg:grid-cols-[0.9fr_1.1fr]">
        <SpotlightCard className="my-10 min-h-[480px] overflow-hidden bg-[#F8F5EF] lg:my-16" as="article">
          <Image src={diodeMachine.src} alt={diodeMachine.alt} width={diodeMachine.width} height={diodeMachine.height} sizes="(min-width: 1024px) 42vw, 92vw" className="size-full object-contain p-8 sm:p-12" />
          <div className="absolute bottom-0 left-0 z-10 border-r border-t border-[#C9AF83] bg-[#5B1830] px-5 py-4"><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#F1DFC1]">Four-wavelength diode platform</p></div>
        </SpotlightCard>
        <div className="flex flex-col justify-center py-16 lg:pl-20" data-reveal="right">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4B77D]">Four-wavelength diode</p>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">Technology made more human.</h2>
          <p className="mt-7 max-w-xl leading-8 text-[#E4D7D1]">The equipment matters. So does how it is used. ESCLARE combines a four-wavelength diode platform with individualized settings, cooling support, considered intervals, and honest expectations.</p>
          <div className="mt-9 grid gap-x-8 gap-y-5 text-sm text-[#F1E6E0] sm:grid-cols-2"><p className="border-l border-[#C4A064] pl-4">Broader wavelength coverage</p><p className="border-l border-[#C4A064] pl-4">Cooling-supported sessions</p><p className="border-l border-[#C4A064] pl-4">Individualized treatment course</p><p className="border-l border-[#C4A064] pl-4">Results vary by person and area</p></div>
          <Link href="/diode-laser" className="luxury-button-light mt-10 w-fit">Explore 4D Diode <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>

    <AttendantSection />
    <ClinicGallery compact />

    <section className="bg-[#FCFAF6] py-20 lg:py-28">
      <div className="public-container">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><div data-reveal><p className="public-eyebrow">Your visit</p><h2 className="public-subheading mt-4">Simple by design.</h2></div><p className="max-w-2xl text-sm leading-7 text-[#62595C]" data-reveal="right">Request your preferred branch and treatment. The team confirms availability directly, with no booking deposit required.</p></div>
        <div className="mt-12 grid border-y border-[#CFC0AC] md:grid-cols-3">{[["01", "Request", "Choose a branch, service, preferred date, and preferred time."], ["02", "Confirm", "The team verifies staff, doctor, room, and equipment availability."], ["03", "Visit", "Arrive for assessment and guidance suited to your goals."]].map(([number, title, copy], index) => <article key={number} className={`py-8 md:px-8 ${index > 0 ? "border-t border-[#CFC0AC] md:border-l md:border-t-0" : ""}`} data-reveal><p className="font-serif text-4xl text-[#A17E48]">{number}</p><h3 className="mt-8 text-2xl text-[#481827]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#62595C]">{copy}</p></article>)}</div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-[#5B1830] py-20 text-white">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-white/10 bg-[#32101E]/35 lg:block" />
      <div className="public-container relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div data-reveal><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8D5B5]">Naga & Daet</p><h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Begin with a conversation.</h2><div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#F0DFD3]"><span className="inline-flex items-center gap-2"><MapPin size={16} /> Two branches</span><span className="inline-flex items-center gap-2"><Stethoscope size={16} /> Doctor-required care identified</span><span className="inline-flex items-center gap-2"><Check size={16} /> No deposit</span></div></div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Link href="/appointment-request" className="luxury-button-light"><CalendarDays size={17} /> Book an appointment</Link><Link href="/branches" className="luxury-button-ghost">Find a branch <ArrowRight size={16} /></Link></div>
      </div>
    </section>
  </main>;
}
