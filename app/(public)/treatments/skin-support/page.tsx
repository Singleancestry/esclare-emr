import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { SkinSupportDirectory } from "@/components/public/skin-support-directory";

export const metadata: Metadata = {
  title: "MCCM Skin Support",
  description:
    "Explore ESCLARE's professional MCCM Skin Support collection with assessment-led planning, documented ingredients, and practical aftercare.",
  alternates: { canonical: "/treatments/skin-support" },
};

export default function SkinSupportPage() {
  return (
    <main>
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-14 sm:py-20">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/treatments">Treatments</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">Skin Support</span>
          </nav>
          <p className="public-eyebrow mt-8">MCCM professional treatments</p>
          <h1 className="public-heading mt-4 max-w-4xl">Skin Support, organized with care.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62595C]">
            Explore professional skin-support options with clear treatment goals, documented product
            information, and an assessment-led approach to suitability and aftercare.
          </p>
          <Link href={"/treatments/skin-support/mccm" as Route} className="luxury-button mt-8">
            Explore the MCCM guide
          </Link>
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="public-container">
          <SkinSupportDirectory />
        </div>
      </section>
    </main>
  );
}
