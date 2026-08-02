import type { Metadata } from "next";
import Link from "next/link";
import { SkinSupportDirectory } from "@/components/public/skin-support-directory";

export const metadata: Metadata = {
  title: "Skin Support | MCCM and Rejuran Product Review",
  description:
    "Browse ESCLARE's review-gated MCCM and Rejuran Skin Support collection for Naga and Daet, with cautious product and regulatory information.",
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
          <p className="public-eyebrow mt-8">MCCM and Rejuran</p>
          <h1 className="public-heading mt-4 max-w-4xl">Skin Support, organized with care.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62595C]">
            Explore each product family without treating packaging, brand recognition, or online
            information as proof of suitability or Philippine authorization. Review-only services
            remain unavailable for online booking.
          </p>
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
