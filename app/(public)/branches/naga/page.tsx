import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import { ClinicGallery } from "@/components/public/clinic-gallery";
import { BUSINESS_NAME } from "@/lib/clinic/brand";
import { getBranch } from "@/lib/clinic/details";
import { branchHeroImages } from "@/lib/clinic/media";

const naga = getBranch("naga");

export const metadata: Metadata = {
  title: { absolute: `${BUSINESS_NAME} – Naga` },
  description:
    "Visit ESCLARE Naga at Elias Angeles Street corner Paz Street. View authentic clinic photos, hours, directions, contact details, and booking information.",
  alternates: { canonical: "/branches/naga" },
  openGraph: {
    siteName: BUSINESS_NAME,
    title: `${BUSINESS_NAME} – Naga`,
    description: "Plan a visit to ESCLARE Naga City.",
    images: [{ url: branchHeroImages.naga.src, alt: "The authentic ESCLARE Naga clinic" }],
  },
};

export default function NagaBranchPage() {
  return (
    <main>
      <section className="relative min-h-[72svh] overflow-hidden bg-[#32101E] text-white">
        <Image
          src={branchHeroImages.naga}
          alt="The authentic ESCLARE Naga reception"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="cinematic-hero-image object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#210814]/62" />
        <div className="public-container relative flex min-h-[72svh] items-end py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase text-[#E8D5B5]">
              Elias Angeles Street · Naga City
            </p>
            <h1 className="mt-5 font-serif text-[clamp(3.1rem,10vw,7rem)] font-semibold leading-[0.9] text-white">
              ESCLARE NAGA
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#F4EAE3] sm:text-base">
              Aesthetic, laser, wellness, and doctor-required care in the center of Naga, subject to
              assessment and confirmed provider availability.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/appointment-request?branch=naga" className="luxury-button-light">
                Request a Naga visit <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href={naga.maps} target="_blank" rel="noreferrer" className="luxury-button-ghost">
                Get directions <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="public-container">
          <div className="grid gap-px bg-[#D8C9B4] md:grid-cols-3">
            <div className="bg-[#FBF8F2] p-6">
              <MapPin className="text-[#9A7740]" size={20} aria-hidden="true" />
              <h2 className="mt-5 font-sans text-sm font-bold text-[#481827]">Address</h2>
              <p className="mt-2 text-sm leading-6 text-[#62595C]">{naga.address}</p>
            </div>
            <div className="bg-[#FBF8F2] p-6">
              <Clock3 className="text-[#9A7740]" size={20} aria-hidden="true" />
              <h2 className="mt-5 font-sans text-sm font-bold text-[#481827]">Opening hours</h2>
              <p className="mt-2 text-sm leading-6 text-[#62595C]">
                {naga.schedule}. {naga.lastClient}.
              </p>
            </div>
            <div className="bg-[#FBF8F2] p-6">
              <Phone className="text-[#9A7740]" size={20} aria-hidden="true" />
              <h2 className="mt-5 font-sans text-sm font-bold text-[#481827]">Call or SMS</h2>
              <a
                href={`tel:${naga.phoneHref}`}
                className="mt-2 inline-block text-sm font-semibold text-[#5B1830]"
              >
                {naga.phone}
              </a>
            </div>
          </div>
          <div className="mt-8 border-l border-[#B98A4D] pl-5">
            <h2 className="text-2xl text-[#481827]">Doctor schedule</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#62595C]">{naga.doctorSchedule}</p>
            <a
              href={naga.messenger}
              target="_blank"
              rel="noreferrer"
              className="public-link mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-[#59141D]"
            >
              <MessageCircle size={16} aria-hidden="true" /> Ask ESCLARE Naga
            </a>
          </div>
        </div>
      </section>

      <ClinicGallery branch="naga" />

      <section className="bg-[#5B1830] py-14 text-white">
        <div className="public-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-[#E8D5B5]">Requested is not confirmed</p>
            <h2 className="mt-3 text-3xl text-white">Ask the Naga team to confirm your visit.</h2>
          </div>
          <Link href="/appointment-request?branch=naga" className="luxury-button-light">
            Request availability <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
