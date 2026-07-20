import type { Route } from "next";
import Link from "next/link";
import { Award, ShieldCheck, Sparkles } from "lucide-react";
import { HeroMedia } from "@/components/public/hero-media";

const trustPoints = [
  [Award, "Patient-focused", "approach"],
  [ShieldCheck, "Trusted technology", "and protocols"],
  [Sparkles, "Personalized care,", "natural-looking results"],
] as const;

const featuredTreatments = [
  ["Pico Laser", "/treatments#laser-and-brightening"],
  ["Diode Laser", "/diode-laser"],
  ["HIFU", "/treatments#lifting-and-contouring"],
  ["Botox", "/treatments#doctor-procedures"],
  ["Skin Rejuvenation", "/treatments#skin-support"],
  ["MCCM Renewal", "/treatments#skin-support"],
  ["Doctor Procedures", "/treatments#doctor-procedures"],
  ["Wellness", "/treatments#wellness"],
] as const;

function TickerSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="treatment-ticker-set" aria-hidden={hidden || undefined}>
      {featuredTreatments.map(([label, href]) => (
        <div className="treatment-ticker-item" key={label}>
          <Link href={href as Route} tabIndex={hidden ? -1 : undefined}>
            {label}
          </Link>
          <span aria-hidden="true">&bull;</span>
        </div>
      ))}
    </div>
  );
}

export function AuthenticHero() {
  return (
    <>
      <section className="hero-stage relative overflow-hidden bg-[#FAF4EC]">
        <HeroMedia />
        <div className="hero-content-layout relative z-10 flex min-h-[inherit] items-center py-16 sm:py-20">
          <div className="hero-content-group">
            <p className="hero-eyebrow hero-reveal hero-reveal-1 public-eyebrow">
              Personalized aesthetic care
            </p>
            <h1 className="hero-heading-metallic hero-reveal hero-reveal-2 mt-6 font-serif text-[clamp(3.2rem,6.4vw,6.7rem)] leading-[0.95]">
              <span className="block">Reveal Your</span>
              <span className="block sm:hidden">Most Radiant</span>
              <span className="block sm:hidden">Self</span>
              <span className="hidden sm:block">Most Radiant Self</span>
            </h1>
            <p className="hero-summary hero-reveal hero-reveal-3 mt-7 max-w-xl text-lg sm:text-xl">
              Advanced aesthetic, laser, and wellness treatments thoughtfully designed around you.
            </p>
            <div className="hero-reveal hero-reveal-4 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/treatments" className="hero-primary-cta luxury-button">
                Explore treatments
              </Link>
              <Link
                href="/appointment-request"
                className="hero-secondary-cta luxury-button-outline"
              >
                Book a consultation
              </Link>
            </div>
            <div className="hero-trust hero-reveal hero-reveal-4 mt-11 grid max-w-2xl grid-cols-3 divide-x divide-[#D6B078]/45">
              {trustPoints.map(([Icon, lineOne, lineTwo]) => (
                <div key={lineOne} className="px-3 text-center first:pl-0 last:pr-0 sm:px-6">
                  <Icon className="hero-trust-icon mx-auto" size={25} strokeWidth={1.4} />
                  <p className="hero-trust-label mt-3 text-[0.68rem] leading-5 sm:text-xs">
                    {lineOne}
                    <br />
                    {lineTwo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <nav className="treatment-ribbon" aria-label="Featured treatment categories">
        <div className="treatment-ticker-track">
          <TickerSet />
          <TickerSet hidden />
        </div>
      </nav>
    </>
  );
}
