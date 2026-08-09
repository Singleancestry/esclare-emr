import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { formatTreatmentPrice, treatments } from "@/lib/services/catalog";
import { skinSupportContent } from "@/lib/services/skin-support";

export function SkinSupportDirectory() {
  return (
    <section aria-labelledby="mccm-heading">
      <div className="max-w-3xl">
        <p className="public-eyebrow">MCCM collection</p>
        <h2 id="mccm-heading" className="public-subheading mt-4">
          Professional skin support
        </h2>
        <p className="mt-4 leading-7 text-[#62595C]">
          Explore professional MCCM treatments with source-grounded benefits, documented
          ingredients, practical aftercare, and assessment-led planning.
        </p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {skinSupportContent.map((product) => {
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
                <h3 className="text-2xl text-[#481827]">{treatment.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#62595C]">{treatment.summary}</p>
                <p className="mt-5 font-semibold text-[#6F263D]">
                  {formatTreatmentPrice(treatment)}
                </p>
                <Link
                  href={`/treatments/${product.slug}` as Route}
                  className="public-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#59141D]"
                >
                  View treatment details <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
