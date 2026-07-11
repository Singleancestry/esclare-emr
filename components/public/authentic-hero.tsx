import Link from "next/link";
import { CalendarDays, Sparkles } from "lucide-react";

export function AuthenticHero() {
  return <section className="relative min-h-[calc(88svh-104px)] overflow-hidden bg-[#32101E] text-white">
    <picture>
      <source media="(max-width: 639px)" type="image/webp" srcSet="/images/optimized/clinic/esclare-naga-hero-mobile-v2.webp" />
      <source type="image/webp" srcSet="/images/optimized/clinic/esclare-naga-hero-v2.webp" />
      <img src="/images/optimized/clinic/esclare-naga-hero-v2.webp" alt="ESCLARE Naga logo wall and crystal chandelier" width="1254" height="706" fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover object-center transition-transform duration-[1600ms] hover:scale-[1.02]" />
    </picture>
    <div className="absolute inset-0 bg-[#210814]/65" />
    <div className="public-container relative flex min-h-[calc(88svh-104px)] items-end py-12 sm:py-16 lg:items-center lg:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E8D5B5]">Aesthetic and wellness care · Naga & Daet</p>
        <h1 className="mt-5 font-serif text-[clamp(3.4rem,11vw,7.8rem)] font-semibold leading-[0.86] text-white">ESCLARE</h1>
        <p className="mt-4 font-serif text-[clamp(1.35rem,3vw,2.2rem)] leading-tight text-[#F3E6D6]">Carefully considered. Beautifully delivered.</p>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#F5EDE7] sm:text-base">Premium treatments, clear regular pricing, and a welcoming clinic experience shaped around thoughtful assessment and realistic guidance.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/appointment-request" className="luxury-button-light"><CalendarDays size={17} /> Request appointment</Link><Link href="/treatments" className="luxury-button-ghost"><Sparkles size={17} /> Explore treatments</Link></div>
      </div>
    </div>
    <div className="absolute bottom-0 right-0 hidden border-l border-t border-white/20 bg-[#32101E]/90 px-7 py-5 text-xs backdrop-blur-md md:block"><span className="text-[#E8D5B5]">Authentic ESCLARE interior</span><span className="ml-3 font-semibold">Naga</span></div>
  </section>;
}
