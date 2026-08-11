import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BUSINESS_NAME } from "@/lib/clinic/brand";

export const metadata: Metadata = {
  title: "MCCM Skin Support & Professional Peels",
  description:
    "Explore source-grounded MCCM professional peel and skin-support options at ESCLARE, with assessment-led planning and careful aftercare.",
  alternates: { canonical: "/treatments/skin-support/mccm" },
  openGraph: {
    siteName: BUSINESS_NAME,
    title: `MCCM Skin Support & Professional Peels | ${BUSINESS_NAME}`,
    description:
      "A clear guide to MCCM peel, Exosome PDRN and eye-contour options described in ESCLARE's supplied product material.",
    url: "/treatments/skin-support/mccm",
  },
};

const sections = [
  {
    title: "Professional peel planning",
    image: "/images/optimized/treatments/skin-support/mccm-source/peels-collection.webp",
    alt: "MCCM professional peel collection shown in the supplied product document",
    copy: "The supplied material presents professional peel options including Whitening, Glutathione, Glycolic, Azelaic and Salicylic peels. Selection and layering depend on the assessed concern and must be performed under an approved clinic protocol.",
    benefits: [
      "Whitening Peel: superficial face or body option spaced every 15 days",
      "Purple Peel 4: 20% TCA and 30% retinoic acid, spaced every 21 days",
      "Professional product selection for pigmentation, post-acne marks and texture goals",
    ],
  },
  {
    title: "MCCM Exosome PDRN",
    image: "/images/optimized/treatments/skin-support/mccm-source/exosome-pdrn.webp",
    alt: "MCCM Exosome PDRN product image from the supplied document",
    copy: "The source positions Exosome PDRN as skin support for hydration, elasticity and smoother-looking texture. ESCLARE presents this conservatively as professional topical cosmetic support, not as a promise of regeneration or a medical result.",
    benefits: [
      "Hydration support",
      "Elasticity and smoother-looking texture",
      "Individualized session planning after assessment",
    ],
  },
  {
    title: "Out Contour eye-area support",
    image: "/images/optimized/treatments/skin-support/mccm-source/out-contour.webp",
    alt: "MCCM Out Contour product image from the supplied document",
    copy: "The supplied material describes Out Contour for hydration and firmness around the eye area and for the appearance of puffiness, dark circles and expression lines. The eye contour is sensitive, so suitability and route must be confirmed before use.",
    benefits: [
      "Eye-area hydration",
      "Firmness, puffiness and dark-circle appearance support",
      "Acetyl Hexapeptide-8, DMAE Tartrate, Tocopherol, Sodium Pyruvate and Panthenol",
    ],
  },
  {
    title: "Tone-support systems",
    image: "/images/optimized/treatments/skin-support/mccm-source/whitening-peel.webp",
    alt: "MCCM professional tone-support peel product from the supplied document",
    copy: "The document also describes Whitening Peel, Tranexamicum and Melano Out options for the appearance of pigmentation and uneven tone. The provider selects products, area, intensity and aftercare after assessment.",
    benefits: [
      "Whitening Peel ingredients include arbutin, citric, lactic, kojic and salicylic acids",
      "Melano Out includes tranexamic acid, nicotinamide mononucleotide, acetyl glucosamine and vitamin C",
      "Face or body-area assessment with sun-protection-led aftercare",
    ],
  },
] as const;

export default function MccmSkinSupportPage() {
  return (
    <main>
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-14 sm:py-20">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/treatments">Treatments</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/treatments/skin-support">Skin Support</Link>{" "}
            <span aria-hidden="true">/</span> <span aria-current="page">MCCM</span>
          </nav>
          <p className="public-eyebrow mt-8">MCCM skin support</p>
          <h1 className="public-heading mt-4 max-w-4xl">
            Professional skin support, explained clearly.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62595C]">
            This guide summarizes the supplied MCCM material without turning promotional claims into
            guarantees. Your provider must confirm the exact product, route, skin condition,
            treatment intensity and aftercare before proceeding.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="public-container grid gap-7 lg:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="editorial-card overflow-hidden">
              <div className="relative aspect-[4/3] bg-[#F8F5F2]">
                <Image
                  src={section.image}
                  alt={section.alt}
                  fill
                  sizes="(min-width: 1024px) 46vw, 94vw"
                  className="object-contain"
                />
              </div>
              <div className="p-7">
                <h2 className="font-serif text-3xl text-[#59141D]">{section.title}</h2>
                <p className="mt-4 leading-7 text-[#62595C]">{section.copy}</p>
                <ul className="mt-5 grid gap-2 text-sm text-[#43201E]">
                  {section.benefits.map((benefit) => (
                    <li key={benefit}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F4E8DA] py-14">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-start gap-3 text-[#59141D]">
              <ShieldCheck className="mt-1 shrink-0" size={20} aria-hidden="true" />
              <p className="max-w-3xl text-sm leading-7">
                Results vary. Patient before-and-after photographs in the supplied document are not
                republished here because the file does not include sufficient consent or
                usage-rights metadata. Product images are reproduced only to identify the source
                material.
              </p>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#62595C]">
              After a professional peel or active treatment, follow the clinic&apos;s written
              guidance, use appropriate sun protection, avoid picking or scrubbing, and contact
              ESCLARE for marked swelling, blistering, worsening pain, discharge or another
              unexpected reaction.
            </p>
          </div>
          <Link href="/appointment-request" className="luxury-button">
            Request an assessment <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
