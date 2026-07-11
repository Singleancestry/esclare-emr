import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ClinicGallery } from "@/components/public/clinic-gallery";

export const metadata: Metadata = { title: "Clinic Gallery", description: "See authentic photographs of the ESCLARE Naga reception, waiting area, treatment rooms, and preparation spaces.", alternates: { canonical: "/gallery" } };
export default function GalleryPage() {
  return <main><section className="bg-[#32101E] py-16 text-white sm:py-24"><div className="public-container"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8D5B5]">Authentic ESCLARE interiors</p><h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">A real look inside the clinic.</h1><p className="mt-6 max-w-2xl leading-8 text-[#E7DAD2]">Every image on this page shows the actual ESCLARE Naga environment. Photographs have been color-corrected and optimized without changing the architecture or layout.</p></div></section><ClinicGallery /><section className="bg-[#5B1830] py-14 text-white"><div className="public-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-3xl text-white">Experience ESCLARE in person.</h2><p className="mt-2 text-sm text-[#E8D9CF]">Choose your branch and preferred visit details.</p></div><Link href="/appointment-request" className="luxury-button-light">Request a visit <ArrowRight size={16} /></Link></div></section></main>;
}
