import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { formatTreatmentPrice, treatments } from "@/lib/services/catalog";
import { skinSupportContent } from "@/lib/services/skin-support";

const productGroups = [
  {
    brand: "MCCM",
    title: "MCCM Skin Support",
    description:
      "Professional topical products presented with exact-product verification and assessment-led treatment planning.",
  },
  {
    brand: "Rejuran",
    title: "Rejuran Skin Support",
    description:
      "Doctor-led treatment concepts that remain unavailable for booking while exact Philippine product authorization is reviewed.",
  },
] as const;

export function SkinSupportDirectory() {
  return (
    <div className="space-y-16">
      {productGroups.map((group) => {
        const products = skinSupportContent.filter((item) => item.brand === group.brand);
        return (
          <section key={group.brand} aria-labelledby={`${group.brand.toLowerCase()}-heading`}>
            <div className="max-w-3xl">
              <p className="public-eyebrow">{group.brand} collection</p>
              <h2 id={`${group.brand.toLowerCase()}-heading`} className="public-subheading mt-4">
                {group.title}
              </h2>
              <p className="mt-4 leading-7 text-[#62595C]">{group.description}</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const treatment = treatments.find((item) => item.slug === product.slug);
                if (!treatment) return null;
                return (
                  <article
                    key={product.slug}
                    className="group overflow-hidden rounded-lg border border-[#D8C9B4] bg-white shadow-[0_12px_32px_rgba(65,30,42,0.07)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F5F2]">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 47vw, 94vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-2xl text-[#481827]">{treatment.name}</h3>
                        <span className="rounded-md bg-[#F7EEDC] px-2 py-1 text-[10px] font-bold uppercase text-[#765A44]">
                          Review
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#62595C]">{treatment.summary}</p>
                      <p className="mt-5 font-semibold text-[#6F263D]">
                        {formatTreatmentPrice(treatment)}
                      </p>
                      <Link
                        href={`/treatments/${product.slug}` as Route}
                        className="public-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#59141D]"
                      >
                        Review product guide <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
      <aside className="flex gap-4 border-l-2 border-[#A34B5B] bg-[#F7EDE8] p-6 text-sm leading-7 text-[#59141D]">
        <ShieldCheck className="mt-1 shrink-0" size={20} aria-hidden="true" />
        <p>
          Product photography identifies the owner-provided packaging for review. Display does not
          confirm availability, authorization, suitability, or a treatment result. Exact stock,
          supplier, route, and current regulatory status must be verified before treatment.
        </p>
      </aside>
    </div>
  );
}
