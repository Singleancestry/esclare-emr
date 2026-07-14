import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, ExternalLink, Facebook, MapPin, MessageCircle, Phone } from "lucide-react";
import { ClinicGallery } from "@/components/public/clinic-gallery";
import { getBranch } from "@/lib/clinic/details";
import { branchHeroImages } from "@/lib/clinic/media";

const daet = getBranch("daet");

export const metadata: Metadata = {
  title: "ESCLARE Daet Aesthetic Center",
  description: "Step inside the authentic ESCLARE Daet clinic on J. Lukban Street. View the branch, opening hours, services, map, and official booking channels.",
  alternates: { canonical: "/branches/daet" },
  openGraph: {
    title: "ESCLARE Daet Aesthetic Center",
    description: "A real look inside ESCLARE Daet in Camarines Norte.",
    images: [{ url: branchHeroImages.daet.src, width: branchHeroImages.daet.width, height: branchHeroImages.daet.height, alt: "The authentic ESCLARE Daet reception" }],
  },
};

export default function DaetBranchPage() {
  return (
    <main>
      <section className="relative min-h-[76svh] overflow-hidden bg-[#32101E] text-white">
        <Image src={branchHeroImages.daet} alt="The authentic ESCLARE Daet reception with the illuminated ESCLARE wordmark" fill priority placeholder="blur" sizes="100vw" className="cinematic-hero-image object-cover object-center" />
        <div className="absolute inset-0 bg-[#210814]/68" />
        <div className="public-container relative flex min-h-[76svh] items-end py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E8D5B5]">J. Lukban Street · Camarines Norte</p>
            <h1 className="mt-5 font-serif text-[clamp(3.1rem,10vw,7rem)] font-semibold leading-[0.9] text-white">ESCLARE DAET</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#F4EAE3] sm:text-base">A bright, welcoming branch for considered aesthetic and wellness care, shown through authentic ESCLARE photography.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/appointment-request?branch=daet" className="luxury-button-light">Request a Daet visit <ArrowRight size={16} /></Link><a href={daet.maps} target="_blank" rel="noreferrer" className="luxury-button-ghost">Get directions <ExternalLink size={15} /></a></div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden border-l border-t border-white/20 bg-[#32101E]/90 px-7 py-5 text-xs md:block"><span className="text-[#E8D5B5]">Authentic branch photography</span><span className="ml-3 font-semibold">Daet</span></div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="public-container grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
          <div data-reveal><p className="public-eyebrow">Plan your visit</p><h2 className="public-subheading mt-4">Welcome to the Daet branch.</h2><p className="mt-5 leading-8 text-[#62595C]">Appointments are confirmed directly by the branch through Facebook, phone call, or SMS. No booking deposit is required.</p></div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-[#D8C9B4] bg-[#D8C9B4] sm:grid-cols-2" data-reveal="right">
            <div className="bg-[#FBF8F2] p-6"><MapPin className="text-[#9A7740]" size={20} /><h3 className="mt-5 font-sans text-sm font-bold text-[#481827]">Address</h3><p className="mt-2 text-sm leading-6 text-[#62595C]">{daet.address}</p></div>
            <div className="bg-[#FBF8F2] p-6"><Clock3 className="text-[#9A7740]" size={20} /><h3 className="mt-5 font-sans text-sm font-bold text-[#481827]">Opening hours</h3><p className="mt-2 text-sm leading-6 text-[#62595C]">{daet.schedule}</p></div>
            <div className="bg-[#FBF8F2] p-6"><Phone className="text-[#9A7740]" size={20} /><h3 className="mt-5 font-sans text-sm font-bold text-[#481827]">Call or SMS</h3><a href={`tel:${daet.phoneHref}`} className="mt-2 inline-block text-sm font-semibold text-[#5B1830]">{daet.phone}</a></div>
            <div className="bg-[#FBF8F2] p-6"><MessageCircle className="text-[#9A7740]" size={20} /><h3 className="mt-5 font-sans text-sm font-bold text-[#481827]">Facebook</h3><a href={daet.facebook} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#5B1830]">ESCLARE Daet <Facebook size={15} /></a></div>
          </div>
        </div>
      </section>

      <section className="bg-[#32101E] py-12 text-white"><div className="public-container grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D4B77D]">Daet treatment availability</p><h2 className="mt-3 text-3xl text-white">All listed treatments except Fractional Laser.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#E7DAD2]">Treatments remain subject to doctor, staff, room, and equipment availability.</p></div><Link href="/treatments" className="luxury-button-light">View treatments <ArrowRight size={16} /></Link></div></section>

      <ClinicGallery branch="daet" />

      <section className="bg-[#5B1830] py-16 text-white"><div className="public-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E8D5B5]">Your visit starts here</p><h2 className="mt-3 text-3xl text-white sm:text-4xl">Request availability with ESCLARE Daet.</h2></div><Link href="/appointment-request?branch=daet" className="luxury-button-light">Request a visit <ArrowRight size={16} /></Link></div></section>
    </main>
  );
}
