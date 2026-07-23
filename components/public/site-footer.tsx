"use client";

import Link from "next/link";
import { Facebook, MapPin, Phone } from "lucide-react";
import type { Route } from "next";
import { clinicBranches } from "@/lib/clinic/details";
import { useSelectedBranch } from "@/components/public/branch-provider";
import { trackPublicEvent } from "@/lib/analytics/public-events";

export function SiteFooter() {
  const { branch } = useSelectedBranch();
  return (
    <footer className="bg-[#3B0D14] text-[#FAF4EC]">
      <div className="public-container grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <Link href="/home" className="font-serif text-4xl tracking-[0.08em]">
            ESCLARE
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#E6D6CC]">
            Aesthetic and wellness care shaped by thoughtful assessment, clear guidance, and warm
            hospitality.
          </p>
          <a
            href={branch.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${branch.name} Facebook Page`}
            onClick={() =>
              trackPublicEvent("facebook_page_clicked", {
                branch: branch.code,
                route: window.location.pathname,
              })
            }
            className="mt-7 inline-flex items-center gap-2 text-sm text-[#E2BF83]"
          >
            <Facebook size={16} /> Facebook
          </a>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#D6B078]">Explore</h2>
          <nav className="mt-5 grid gap-3 text-sm text-[#F2E8DF]">
            <Link href="/treatments">Treatments</Link>
            <Link href={"/glp-1-slimming" as Route}>GLP-1 Slimming</Link>
            <Link href={"/skin-education" as Route}>Skin Education</Link>
            <Link href="/about">About</Link>
            <Link href={"/aftercare" as Route}>Aftercare</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/appointment-request">Book a consultation</Link>
            <Link href="/login">Staff access</Link>
          </nav>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#D6B078]">Our clinics</h2>
          <div className="mt-5 space-y-6">
            {clinicBranches.map((branch) => (
              <div key={branch.code} className="text-sm">
                <p className="font-serif text-xl">{branch.name}</p>
                <p className="mt-2 flex gap-2 leading-6 text-[#E6D6CC]">
                  <MapPin className="mt-1 shrink-0 text-[#D6B078]" size={14} /> {branch.address}
                </p>
                <a
                  className="mt-2 flex items-center gap-2 text-[#E2BF83]"
                  href={`tel:${branch.phoneHref}`}
                >
                  <Phone size={14} /> {branch.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="public-container flex flex-col gap-3 py-5 text-[11px] text-[#CDBDB5] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} ESCLARE Aesthetic & Wellness Clinic.</p>
          <div className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
