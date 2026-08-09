import type { Metadata } from "next";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, ExternalLink, Facebook, MapPin, Phone } from "lucide-react";
import { TrackedLink } from "@/components/public/tracked-link";
import { clinicBranches } from "@/lib/clinic/details";
import { branchHeroImages } from "@/lib/clinic/media";

export const metadata: Metadata = {
  title: "ESCLARE Branches | Naga City and Daet Aesthetic Clinics",
  description:
    "Visit ESCLARE in Naga City or Daet. Find verified addresses, clinic hours, contact details, directions, treatment availability, and branch booking links.",
  alternates: { canonical: "/branches" },
};

const branchVisuals = {
  naga: {
    image: branchHeroImages.naga,
    alt: "The authentic ESCLARE Naga reception and textured logo wall",
    location: "Naga City",
  },
  daet: {
    image: branchHeroImages.daet,
    alt: "The authentic ESCLARE Daet reception and illuminated wordmark",
    location: "Camarines Norte",
  },
} as const;

export default function BranchesPage() {
  return (
    <main>
      <section className="bg-[#EEE6DA] py-16 sm:py-24">
        <div className="public-container">
          <p className="public-eyebrow">Visit ESCLARE</p>
          <h1 className="public-heading mt-4">Visit ESCLARE in Naga City or Daet</h1>
          <p className="mt-6 max-w-2xl leading-8 text-[#62595C]">
            Explore authentic views of each clinic, then connect directly for confirmed
            availability.
          </p>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="public-container space-y-14">
          {clinicBranches.map((branch) => {
            const visual = branchVisuals[branch.code];
            return (
              <article
                id={branch.code}
                key={branch.code}
                className="grid overflow-hidden rounded-lg border border-[#D8C9B4] bg-white shadow-[0_18px_46px_rgb(72_42_48_/_8%)] lg:grid-cols-[0.52fr_0.48fr]"
                data-reveal
              >
                <div className="relative min-h-80 overflow-hidden lg:min-h-[34rem]">
                  <Image
                    src={visual.image}
                    alt={visual.alt}
                    fill
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    placeholder="blur"
                    className="object-cover transition-transform duration-[1400ms] hover:scale-[1.025]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-[#32101E]/90 p-5 text-white">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E8D5B5]">
                        Authentic clinic interior
                      </p>
                      <p className="mt-1 font-serif text-2xl">{branch.name}</p>
                    </div>
                    <span className="text-xs text-[#E8D5B5]">{visual.location}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-10">
                  <div>
                    <p className="public-eyebrow">{visual.location}</p>
                    <h2 className="mt-4 text-4xl text-[#481827]">{branch.name}</h2>
                    <p className="mt-7 flex items-start gap-3 text-sm leading-7 text-[#5E5759]">
                      <MapPin className="mt-1 shrink-0 text-[#9A7740]" size={18} /> {branch.address}
                    </p>
                    <p className="mt-4 flex items-center gap-3 text-sm text-[#5E5759]">
                      <Clock3 className="shrink-0 text-[#9A7740]" size={18} /> {branch.schedule}
                    </p>
                    {branch.lastClient && (
                      <p className="mt-2 pl-8 text-xs text-[#71686B]">{branch.lastClient}</p>
                    )}
                    <p className="mt-3 border-l border-[#B99559] pl-4 text-xs leading-6 text-[#62595C]">
                      {branch.doctorSchedule}
                    </p>
                    <TrackedLink
                      href={`tel:${branch.phoneHref}`}
                      event="phone_clicked"
                      parameters={{ branch: branch.code }}
                      className="mt-7 inline-flex items-center gap-3 text-xl font-semibold text-[#5B1830]"
                    >
                      <Phone size={20} /> {branch.phone}
                    </TrackedLink>
                    <div className="mt-9 border-l-2 border-[#B99559] pl-4">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#6F263D]">
                        Treatment availability
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#62595C]">
                        {branch.unavailableTreatments.length === 0
                          ? "Treatment availability is confirmed by the branch based on the appropriate provider, room, and equipment."
                          : `This branch does not offer ${branch.unavailableTreatments.join(", ")}. Other treatment availability is confirmed directly by the branch.`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link href={`/branches/${branch.code}` as Route} className="luxury-button">
                      Explore {branch.code === "daet" ? "Daet" : "Naga"} <ArrowRight size={15} />
                    </Link>
                    <TrackedLink
                      href={branch.maps}
                      event="directions_clicked"
                      parameters={{ branch: branch.code }}
                      target="_blank"
                      rel="noreferrer"
                      className="luxury-button-outline"
                    >
                      Directions <ExternalLink size={15} />
                    </TrackedLink>
                    <a
                      href={branch.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="luxury-button-outline"
                    >
                      <Facebook size={16} /> Facebook
                    </a>
                    <TrackedLink
                      href={`/appointment-request?branch=${branch.code}`}
                      event="booking_button_clicked"
                      parameters={{ branch: branch.code }}
                      className="luxury-button-outline"
                    >
                      Request visit <ArrowRight size={15} />
                    </TrackedLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
