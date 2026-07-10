import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const services = ["4D Diode Laser", "Pico Laser", "Korean Facial", "7D HIFU", "Doctor Procedures"];

export default function PublicHomePage() {
  return (
    <main className="min-h-screen bg-[#F8F4ED] text-[#262626]">
      <section className="grid min-h-[88vh] grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between px-6 py-6 sm:px-10 lg:px-16">
          <nav className="flex items-center justify-between">
            <Link href="/home" className="font-serif text-2xl font-semibold text-[#6F263D]">
              ESCLARE
            </Link>
            <div className="flex items-center gap-3">
              <Link className="text-sm font-medium text-[#481827]" href="/login">
                Patient login
              </Link>
              <Link
                className="rounded bg-[#6F263D] px-4 py-2 text-sm font-semibold text-white focus-ring"
                href={"/appointment-request" as Route}
              >
                Request appointment
              </Link>
            </div>
          </nav>

          <div className="max-w-3xl py-16">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#6F263D]">
              Aesthetic and wellness clinic
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[#481827] sm:text-6xl">
              ESCLARE Aesthetic & Wellness Clinic
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3D3D3D]">
              Warm, physician-guided aesthetic care across Naga and Daet with treatment plans,
              packages and follow-up workflows designed around safe outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded bg-[#6F263D] px-5 py-3 text-sm font-semibold text-white focus-ring"
              >
                View services <ArrowRight size={18} aria-hidden />
              </Link>
              <Link
                href={"/branches" as Route}
                className="inline-flex items-center gap-2 rounded border border-[#C6A467] px-5 py-3 text-sm font-semibold text-[#481827] focus-ring"
              >
                <MapPin size={18} aria-hidden /> Find a branch
              </Link>
            </div>
          </div>

          <div className="grid gap-4 pb-4 sm:grid-cols-3">
            <div className="border-l-2 border-[#C6A467] pl-4">
              <ShieldCheck className="mb-2 text-[#6F263D]" size={22} aria-hidden />
              <p className="text-sm font-semibold">Consent-led care</p>
            </div>
            <div className="border-l-2 border-[#C6A467] pl-4">
              <Sparkles className="mb-2 text-[#6F263D]" size={22} aria-hidden />
              <p className="text-sm font-semibold">Premium treatments</p>
            </div>
            <div className="border-l-2 border-[#C6A467] pl-4">
              <MapPin className="mb-2 text-[#6F263D]" size={22} aria-hidden />
              <p className="text-sm font-semibold">Naga and Daet</p>
            </div>
          </div>
        </div>

        <div className="bg-[#6F263D] px-6 py-10 text-white lg:px-12">
          <div className="flex h-full flex-col justify-end">
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-[#F8F4ED]">Featured care</p>
            <div className="grid gap-3">
              {services.map((service) => (
                <Link
                  key={service}
                  className="flex items-center justify-between rounded border border-white/20 bg-white/10 px-4 py-4 text-base font-semibold focus-ring"
                  href="/services"
                >
                  {service}
                  <ArrowRight size={18} aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
