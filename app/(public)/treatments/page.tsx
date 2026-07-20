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
  treatmentCategories,
  treatments,
} from "@/lib/services/catalog";

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
          {treatmentCategories.map((category) => (
            <a
              key={category}
              href={`#${category.replaceAll(" ", "-").toLowerCase()}`}
              className="public-link pb-1 text-xs font-bold uppercase tracking-[0.06em] text-[#5B1830]"
            >
              {category}
            </a>
          ))}
          <a
            href="#4d-diode-packages"
            className="public-link pb-1 text-xs font-bold uppercase tracking-[0.06em] text-[#5B1830]"
          >
            4D Diode
          </a>
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

      <section
        className="border-y border-[#D8C9B4] bg-white py-16 sm:py-24"
        aria-labelledby="mccm-detail-heading"
      >
        <div className="public-container grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
          <div data-reveal>
            <p className="public-eyebrow">Professional skin support</p>
            <h2 id="mccm-detail-heading" className="public-subheading mt-4">
              MCCM PDRN Glow &amp; Eye Rejuvenation
            </h2>
            <p className="mt-3 font-serif text-xl text-[#6F263D]">
              Brightening, hydration and eye-contour treatment
            </p>
            <p className="mt-5 leading-7 text-[#62595C]">
              This professional facial combines MCCM Glutathione Peeling, PDRN and Out Contour
              Cocktail to support dull, dehydrated and uneven-looking skin after an individual
              assessment.
            </p>
            <div className="mt-7 rounded-lg border border-[#CFB785] bg-[#F8F1E8] p-6 shadow-[0_12px_28px_rgba(65,30,42,0.07)]">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7A6542]">
                Regular price
              </p>
              <p className="mt-2 font-serif text-3xl text-[#481827]">
                PHP 3,800 <span className="font-sans text-sm text-[#62595C]">per session</span>
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3" data-reveal>
            {[
              [
                "Glutathione Peeling",
                "Gently exfoliates and may improve the appearance of dullness, superficial pigmentation, texture and pores.",
              ],
              [
                "PDRN",
                "Supports hydration and recovery while helping skin look softer, smoother and refreshed.",
              ],
              [
                "Out Contour Cocktail",
                "Hydrates the delicate eye area and may improve the appearance of puffiness, dark circles, dryness and fine lines.",
              ],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-lg border border-[#D8C9B4] bg-[#FCFAF6] p-5 shadow-[0_8px_22px_rgba(65,30,42,0.05)]"
              >
                <h3 className="text-lg text-[#481827]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#62595C]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="public-container mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-[#D8C9B4] bg-[#FCFAF6] p-6 sm:p-8" data-reveal>
            <h3 className="text-2xl text-[#481827]">What to expect</h3>
            <p className="mt-4 text-sm leading-7 text-[#62595C]">
              Some clients may notice brighter, smoother and more hydrated-looking skin after the
              first session, with further changes developing over one to two weeks. Results and the
              appropriate interval vary with skin condition, sensitivity and treatment goals.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#62595C]">
              Temporary redness, sensitivity, tightness, dryness or light peeling may occur. Contact
              the clinic promptly for severe pain, blistering, significant swelling, signs of
              infection or a reaction that continues to worsen.
            </p>
          </div>
          <div className="rounded-lg border border-[#D8C9B4] bg-[#FCFAF6] p-6 sm:p-8" data-reveal>
            <h3 className="text-2xl text-[#481827]">Essential aftercare</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#62595C]">
              <li>
                <strong className="text-[#481827]">First 6-8 hours:</strong> keep the area dry;
                avoid makeup, added skincare, rubbing and scratching.
              </li>
              <li>
                <strong className="text-[#481827]">First 24-72 hours:</strong> use gentle,
                fragrance-free care and SPF 30-50; minimize sun, heat and heavy sweating.
              </li>
              <li>
                <strong className="text-[#481827]">For 5-7 days:</strong> avoid retinoids,
                exfoliating acids, scrubs, benzoyl peroxide, waxing, saunas, swimming and intensive
                facial treatments unless cleared by the clinic.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="public-container py-16 sm:py-24">
        {treatmentCategories.map((category, categoryIndex) => {
          const items = treatments.filter((item) => item.public && item.category === category);
          const sectionId = category.replaceAll(" ", "-").toLowerCase();
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
                    {category}
                  </h2>
                  <p className="mt-3 text-sm text-[#746A6D]">
                    {items.length} {items.length === 1 ? "treatment" : "treatments"}
                  </p>
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
                        {item.doctorRequired && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#F2E7E2] px-2 py-1 text-[10px] font-bold uppercase text-[#6F263D]">
                            <Stethoscope size={12} aria-hidden="true" /> Doctor
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[#625D58]">{item.summary}</p>
                      <div className="mt-7 border-t border-[#E8E0D7] pt-4">
                        <p className="text-sm font-bold text-[#6F263D]">
                          {formatTreatmentPrice(item)}
                        </p>
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
              <h2 className="mt-3 text-3xl text-[#481827]">4D Diode packages</h2>
              <p className="mt-4 text-sm leading-7 text-[#6B6264]">
                Package totals for 2-6 sessions. Diode laser supports long-term hair reduction
                rather than permanent removal; the appropriate course and interval vary by area and
                response.
              </p>
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
            >
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="bg-[#5B1830] text-white">
                  <tr>
                    <th className="p-4">Treatment area</th>
                    {[2, 3, 4, 5, 6].map((count) => (
                      <th className="p-4" key={count}>
                        {count} sessions
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
                        <span className="mt-1 block text-[10px] font-normal uppercase text-[#8A7A6F]">
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
