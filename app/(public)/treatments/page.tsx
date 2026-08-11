import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, CalendarDays, CheckCircle2, Stethoscope } from "lucide-react";
import { treatmentGalleryCategories } from "@/lib/clinic/treatment-media";
import {
  catalogEffectiveDate,
  diodePackages,
  formatTreatmentPrice,
  treatments,
} from "@/lib/services/catalog";
import { treatmentNavigationItems } from "@/lib/services/treatment-navigation";

export const metadata: Metadata = {
  title: "Treatments & Prices",
  description:
    "Explore ESCLARE facials, laser treatments, HIFU, professional skin support, doctor-led aesthetics and regular prices in Naga and Daet.",
  alternates: { canonical: "/treatments" },
};

const php = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const orderedTreatmentCategories = treatmentNavigationItems.flatMap((item) =>
  item.catalogCategory ? [item.catalogCategory] : [],
);

export default function TreatmentsPage() {
  return (
    <main>
      <section className="bg-[#32101E] py-16 text-white sm:py-24">
        <div className="public-container">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8D5B5]">
            ESCLARE treatment menu
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">
            Advanced care, selected for you.
          </h1>
          <p className="mt-6 max-w-2xl leading-8 text-[#E7DAD2]">
            Explore treatment settings, technology and regular rates before your visit. Final
            suitability, settings and treatment plans are confirmed after assessment.
          </p>
          <p className="mt-5 text-xs text-[#CDBBB0]">
            Price reference effective{" "}
            {new Date(`${catalogEffectiveDate}T00:00:00`).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </div>
      </section>

      <nav
        aria-label="Treatment categories"
        className="public-scrollbar-hide sticky top-[72px] z-30 overflow-x-auto border-b border-[#D8C9B4] bg-[#FBF8F2]/95 backdrop-blur-xl"
      >
        <div className="public-container flex min-w-max gap-6 py-4">
          {treatmentNavigationItems.slice(1).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="public-link pb-1 text-xs font-bold uppercase tracking-[0.06em] text-[#5B1830]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section
        className="bg-[#F6F0E8] py-16 sm:py-24"
        aria-labelledby="signature-treatments-heading"
      >
        <div className="public-container">
          <div className="max-w-3xl" data-reveal>
            <p className="public-eyebrow">Signature treatments</p>
            <h2 id="signature-treatments-heading" className="public-subheading mt-4">
              See the care behind each service.
            </h2>
            <p className="mt-4 leading-7 text-[#62595C]">
              These curated visuals show representative treatment settings and technology. They are
              not before-and-after images and do not promise a particular result.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {treatmentGalleryCategories.map((category) => {
              const image = category.images[0];
              return (
                <article
                  key={category.id}
                  className="group overflow-hidden rounded-lg border border-[#D8C9B4] bg-white shadow-[0_12px_35px_rgba(70,38,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(70,38,43,0.14)]"
                  data-reveal
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E8DED3]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 768px) 47vw, 94vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl text-[#481827]">{category.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#62595C]">{category.introduction}</p>
                    <Link
                      href={category.treatmentHref as Route}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#6F263D]"
                    >
                      View rates <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="public-container py-16 sm:py-24">
        {orderedTreatmentCategories.map((category, categoryIndex) => {
          const items = treatments.filter((item) => item.public && item.category === category);
          const sectionId = category.replaceAll(" ", "-").toLowerCase();
          const categoryLabel =
            treatmentNavigationItems.find((item) => item.catalogCategory === category)?.label ??
            category;
          return (
            <section
              key={category}
              id={sectionId}
              className="scroll-mt-36 border-t border-[#CCBCA7] py-12 first:border-t-0 first:pt-0"
              aria-labelledby={`heading-${categoryIndex}`}
            >
              <div className="grid gap-8 lg:grid-cols-[0.3fr_0.7fr]">
                <div data-reveal>
                  <p className="public-eyebrow">{String(categoryIndex + 1).padStart(2, "0")}</p>
                  <h2 id={`heading-${categoryIndex}`} className="mt-3 text-3xl text-[#481827]">
                    {categoryLabel}
                  </h2>
                  <p className="mt-3 text-sm text-[#746A6D]">
                    {items.length} {items.length === 1 ? "treatment" : "treatments"}
                  </p>
                  {category === "Skin Support" && (
                    <Link
                      href="/treatments/skin-support"
                      className="public-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#6F263D]"
                    >
                      Browse MCCM Skin Support <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((item) => (
                    <article
                      key={item.slug}
                      className="group min-h-60 rounded-lg border border-[#D8C9B4] bg-white p-6 shadow-[0_8px_24px_rgba(65,30,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#B99A68] hover:shadow-[0_18px_40px_rgba(65,30,42,0.11)]"
                      data-reveal
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl text-[#3F1724]">{item.name}</h3>
                        {(item.doctorRequired || item.assessmentRequired) && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#F2E7E2] px-2 py-1 text-[10px] font-bold uppercase text-[#6F263D]">
                            <Stethoscope size={12} aria-hidden="true" />{" "}
                            {item.doctorRequired ? "Doctor" : "Assessment"}
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[#625D58]">{item.summary}</p>
                      {item.areas && (
                        <dl className="mt-5 divide-y divide-[#E8E0D7] border-y border-[#E8E0D7] text-sm">
                          {item.areas.map((area) => (
                            <div
                              key={area.name}
                              className="flex items-start justify-between gap-4 py-2.5"
                            >
                              <dt className="text-[#625D58]">{area.name}</dt>
                              <dd className="shrink-0 font-bold text-[#6F263D]">{area.price}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <div className="mt-7 border-t border-[#E8E0D7] pt-4">
                        {item.slug !== "exilift-face" && item.slug !== "7d-hifu-face" && (
                          <p className="text-sm font-bold text-[#6F263D]">
                            {formatTreatmentPrice(item)}
                          </p>
                        )}
                        <Link
                          href={`/treatments/${item.slug}` as Route}
                          className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-[#6F263D]"
                        >
                          Treatment guide <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section id="4d-diode-packages" className="scroll-mt-36 border-t border-[#CCBCA7] pt-14">
          <div className="grid gap-8 lg:grid-cols-[0.3fr_0.7fr]">
            <div data-reveal>
              <p className="public-eyebrow">Package menu</p>
              <h2 className="mt-3 text-3xl text-[#481827]">
                4D Wavelength Diode Laser Hair Removal
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6B6264]">
                Regular prices for 1-6 sessions. Diode laser supports long-term hair reduction
                rather than permanent removal; the appropriate course and interval vary by area and
                response.
              </p>
              <Link
                href={"/package-terms" as Route}
                className="public-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#6F263D]"
              >
                Review treatment-package terms <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <div className="mt-6 flex gap-3 text-sm leading-6 text-[#625D58]">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#9A7740]"
                  size={18}
                  aria-hidden="true"
                />
                <span>Four-wavelength system with cooling support</span>
              </div>
            </div>
            <div
              className="overflow-x-auto rounded-lg border border-[#D8C9B4] bg-white shadow-[0_12px_30px_rgba(65,30,42,0.07)]"
              data-reveal
              role="region"
              aria-label="4D diode laser pricing table"
              tabIndex={0}
            >
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead className="bg-[#5B1830] text-white">
                  <tr>
                    <th className="p-4">Treatment area</th>
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <th className="p-4" key={count}>
                        {count} {count === 1 ? "session" : "sessions"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {diodePackages.map((item) => (
                    <tr
                      key={item.area}
                      className="border-t border-[#E8E0D7] transition-colors hover:bg-[#F6F0E8]"
                    >
                      <th className="p-4 font-semibold text-[#481827]">
                        {item.area}
                        <span className="mt-1 block text-[10px] font-normal uppercase text-[#6F625A]">
                          {item.category}
                        </span>
                      </th>
                      {item.options.map((option) => (
                        <td className="p-4" key={option.sessions}>
                          {php.format(option.price)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#EEE6DA] py-14">
        <div className="public-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="public-eyebrow">Personal guidance</p>
            <h2 className="mt-3 text-3xl text-[#481827]">Not sure where to begin?</h2>
            <p className="mt-2 text-sm text-[#62595C]">
              Tell the team what you would like to improve and request an assessment. Requests
              remain pending until confirmed by ESCLARE.
            </p>
          </div>
          <Link href="/appointment-request" className="luxury-button shrink-0">
            <CalendarDays size={17} aria-hidden="true" /> Request appointment{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
