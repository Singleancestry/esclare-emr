import Link from "next/link";
import { ArrowDown, CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function AuthenticHero() {
  return <section className="premium-trace relative min-h-[calc(88svh-104px)] overflow-hidden bg-[#32101E] text-white">
    <picture>
      <source media="(max-width: 639px)" type="image/webp" srcSet="/images/optimized/clinic/esclare-naga-hero-mobile-v2.webp" />
      <source type="image/webp" srcSet="/images/optimized/clinic/esclare-naga-hero-v2.webp" />
      <img src="/images/optimized/clinic/esclare-naga-hero-v2.webp" alt="ESCLARE Naga logo wall and crystal chandelier" width="1254" height="706" fetchPriority="high" decoding="async" className="cinematic-hero-image absolute inset-0 size-full object-cover object-center" />
    </picture>
    <div className="absolute inset-0 bg-[#210814]/70" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,7,17,.55),transparent_72%)]" />
    <div className="public-container relative flex min-h-[calc(88svh-104px)] items-end py-12 sm:py-16 lg:items-center lg:py-20">
      <div className="max-w-3xl">
        <div className="hero-reveal hero-reveal-1 flex items-center gap-3"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E8D5B5]">Aesthetic & wellness clinic</p><span className="h-px w-12 bg-[#D4B77D]" /><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E8D5B5]">Naga & Daet</p></div>
        <h1 className="hero-reveal hero-reveal-2 mt-7 font-serif text-[clamp(3.4rem,11vw,7.8rem)] font-semibold leading-[0.86] text-white">ESCLARE</h1>
        <p className="hero-reveal hero-reveal-3 mt-5 font-serif text-[clamp(1.3rem,3vw,2.1rem)] leading-tight text-[#F3E6D6]">Advanced aesthetics, thoughtfully delivered.</p>
        <p className="hero-reveal hero-reveal-4 mt-6 max-w-2xl text-sm leading-7 text-[#F5EDE7] sm:text-base">Personalized laser, skin, body and doctor-led treatments in Naga and Daet.</p>
        <div className="hero-reveal hero-reveal-4 mt-8 flex flex-col gap-3 sm:flex-row"><SpotlightCard className="inline-flex"><Link href="/appointment-request" className="luxury-button-light relative z-10 w-full"><CalendarDays size={17} /> Book an appointment</Link></SpotlightCard><Link href="/treatments" className="luxury-button-ghost"><Sparkles size={17} /> Explore treatments</Link></div>
        <div className="hero-reveal hero-reveal-4 mt-8 grid max-w-2xl gap-2 text-xs text-[#EEE2DA] sm:grid-cols-2"><p className="flex items-center gap-2"><MapPin size={14} className="text-[#D4B77D]" /> Naga · Daily, 10:00 AM-7:00 PM</p><p className="flex items-center gap-2"><Clock3 size={14} className="text-[#D4B77D]" /> Daet · Tue-Sun, 9:30 AM-6:00 PM</p></div>
      </div>
    </div>
    <Link href="/about" aria-label="Discover the ESCLARE approach" className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 lg:flex">Discover <ArrowDown className="hero-scroll" size={15} /></Link>
    <div className="absolute bottom-0 right-0 hidden border-l border-t border-white/20 bg-[#32101E]/90 px-7 py-5 text-xs backdrop-blur-md md:block"><span className="text-[#E8D5B5]">Authentic ESCLARE interior</span><span className="ml-3 font-semibold">Naga</span></div>
  </section>;
}
