import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";
import { SkinEducationExplorer } from "@/components/public/skin-education-explorer";
import { educationCategories, getVisibleEducationArticles } from "@/lib/content/skin-education";

export const metadata: Metadata = {
  title: "Skin Education",
  description:
    "Clear, cautious guides to laser treatments, skin concerns, professional skincare, and doctor-led weight management from ESCLARE.",
  alternates: { canonical: "/skin-education" },
  openGraph: {
    title: "ESCLARE Skin Education",
    description:
      "Understand treatments, preparation, recovery, limitations, and questions to ask before consultation.",
    type: "website",
    images: ["/images/optimized/treatments/pico-face/pico-face-overview.webp"],
  },
};

export default function SkinEducationPage() {
  const includeDrafts = process.env.NODE_ENV !== "production";
  const articles = getVisibleEducationArticles(includeDrafts);
  const featured = articles[0];

  return (
    <main>
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-14 sm:py-20">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
            <Link href="/home">Home</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">Skin Education</span>
          </nav>
          <div className="mt-9 grid gap-8 lg:grid-cols-[0.68fr_0.32fr] lg:items-end">
            <div>
              <p className="public-eyebrow">Knowledge before treatment</p>
              <h1 className="public-heading mt-4 max-w-4xl">Skin Education</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#62595C] sm:text-lg">
                Thoughtful guides to help you understand what a treatment may address, what happens
                during a visit, how recovery is supported, and why suitability must be assessed in
                person.
              </p>
            </div>
            <div className="border-l border-[#B98A4D] pl-5 text-sm leading-7 text-[#62595C]">
              <BookOpen className="mb-3 text-[#6F263D]" size={22} aria-hidden="true" />
              Educational information only. These articles do not diagnose a condition, prescribe
              treatment, or replace consultation with a qualified professional.
            </div>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="py-14 sm:py-20" aria-labelledby="featured-article-heading">
          <div className="public-container grid overflow-hidden border-y border-[#D8C9B4] bg-white lg:grid-cols-2">
            <div className="relative min-h-72 lg:min-h-[30rem]">
              <Image
                src={featured.heroImage}
                alt={featured.heroAlt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="public-eyebrow">Featured guide</p>
              <h2
                id="featured-article-heading"
                className="mt-4 text-3xl leading-tight text-[#481827] sm:text-4xl"
              >
                {featured.title}
              </h2>
              <p className="mt-5 leading-8 text-[#62595C]">{featured.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#765A44]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} aria-hidden="true" /> {featured.readingMinutes} min read
                </span>
                {featured.status === "medical-review-required" && (
                  <span className="font-bold text-[#6F263D]">Local editorial preview</span>
                )}
              </div>
              <Link
                href={`/skin-education/${featured.slug}` as Route}
                className="luxury-button mt-8 self-start"
              >
                Read the guide <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16" aria-label="Editorial review status">
          <div className="public-container border-y border-[#D8C9B4] py-12 text-center">
            <h2 className="text-3xl text-[#481827]">
              The education library is in clinical review.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#62595C]">
              Draft treatment and medicine guides remain unpublished until ESCLARE completes its
              medical and editorial approval workflow.
            </p>
          </div>
        </section>
      )}

      <section
        className="border-y border-[#D8C9B4] bg-white py-12"
        aria-labelledby="categories-heading"
      >
        <div className="public-container">
          <p className="public-eyebrow">Browse by subject</p>
          <h2 id="categories-heading" className="mt-3 text-3xl text-[#481827]">
            Education categories
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {educationCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/skin-education/category/${category.slug}` as Route}
                className="group border-l border-[#B98A4D] bg-[#FCFAF6] p-5 transition-colors hover:bg-[#F4E8DA]"
              >
                <h3 className="text-xl text-[#481827]">{category.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#62595C]">{category.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#6F263D]">
                  Browse <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="article-library-heading">
        <div className="public-container">
          <p className="public-eyebrow">Article library</p>
          <h2 id="article-library-heading" className="mt-3 text-3xl text-[#481827] sm:text-4xl">
            Learn at your own pace
          </h2>
          {articles.length > 0 ? (
            <div className="mt-8">
              <SkinEducationExplorer articles={articles} />
            </div>
          ) : (
            <p className="mt-6 text-sm leading-7 text-[#62595C]">
              No public articles are available yet. Contact ESCLARE for current treatment guidance.
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#3B0D14] py-14 text-white">
        <div className="public-container flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B078]">
              Personal assessment
            </p>
            <h2 className="mt-3 text-3xl">Turn questions into a thoughtful plan.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E6D6CC]">
              Request your preferred branch, date, and time. ESCLARE will confirm availability after
              reviewing your request.
            </p>
          </div>
          <Link href="/appointment-request" className="luxury-button-light shrink-0">
            <CalendarDays size={17} aria-hidden="true" /> Request consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
