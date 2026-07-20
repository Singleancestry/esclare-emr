import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import {
  educationArticles,
  getEducationArticle,
  getEducationCategory,
} from "@/lib/content/skin-education";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return educationArticles
    .filter((article) => article.published || process.env.NODE_ENV !== "production")
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getEducationArticle(slug);
  if (!article) return {};
  const isPublic = article.published;
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: { canonical: `/skin-education/${article.slug}` },
    robots: isPublic ? undefined : { index: false, follow: false },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.heroImage, alt: article.heroAlt }],
    },
  };
}

export default async function EducationArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getEducationArticle(slug);
  if (!article || (!article.published && process.env.NODE_ENV === "production")) notFound();
  const category = getEducationCategory(article.category);
  const related = article.relatedArticles
    .map((relatedSlug) => getEducationArticle(relatedSlug))
    .filter((item) => item !== undefined);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  const articleUrl = `${siteUrl}/skin-education/${article.slug}`;
  const articleSchema = article.published
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: `${siteUrl}${article.heroImage}`,
        author: { "@type": "Organization", name: article.author },
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        mainEntityOfPage: articleUrl,
      }
    : null;
  const faqSchema = article.published
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <main>
      <article>
        <header className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-10 sm:py-14">
          <div className="public-container">
            <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
              <Link href="/home">Home</Link> <span aria-hidden="true">/</span>{" "}
              <Link href={"/skin-education" as Route}>Skin Education</Link>{" "}
              <span aria-hidden="true">/</span>{" "}
              <Link href={`/skin-education/category/${article.category}` as Route}>
                {category?.name}
              </Link>{" "}
              <span aria-hidden="true">/</span> <span aria-current="page">Article</span>
            </nav>
            <div className="mt-9 max-w-5xl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#765A44]">
                <span className="rounded-md bg-white/70 px-2.5 py-1">{category?.name}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} aria-hidden="true" /> {article.readingMinutes} min read
                </span>
                <time dateTime={article.updatedAt}>
                  Updated{" "}
                  {new Intl.DateTimeFormat("en-PH", { dateStyle: "long" }).format(
                    new Date(article.updatedAt),
                  )}
                </time>
              </div>
              <h1 className="mt-5 text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] text-[#3B0D14]">
                {article.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62595C]">{article.excerpt}</p>
              <p className="mt-5 text-sm text-[#765A44]">By {article.author}</p>
            </div>
          </div>
        </header>

        <div className="public-container py-10 sm:py-14">
          {article.status === "medical-review-required" && (
            <div
              className="mb-8 flex gap-3 border-l-4 border-[#B98A4D] bg-[#F8F1E8] p-4 text-sm leading-6 text-[#5F4240]"
              role="note"
            >
              <AlertCircle
                className="mt-0.5 shrink-0 text-[#6F263D]"
                size={19}
                aria-hidden="true"
              />
              <p>
                <strong>Editorial preview:</strong> this draft requires review and approval by an
                appropriately qualified ESCLARE clinician before public publication. It is noindex
                and excluded from the production article library.
              </p>
            </div>
          )}
          <div className="relative aspect-[16/7] overflow-hidden rounded-lg bg-[#E9DED1]">
            <Image
              src={article.heroImage}
              alt={article.heroAlt}
              fill
              priority
              sizes="(min-width: 1320px) 82rem, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
            <aside
              className="h-fit border-l border-[#B98A4D] pl-5 lg:sticky lg:top-28"
              aria-label="Table of contents"
            >
              <h2 className="font-sans text-xs font-bold uppercase text-[#6F263D]">
                In this guide
              </h2>
              <nav className="mt-4 grid gap-3 text-sm leading-6 text-[#62595C]">
                <a href="#key-takeaways">Key takeaways</a>
                {article.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.title}
                  </a>
                ))}
                <a href="#beforecare">Beforecare</a>
                <a href="#aftercare">Aftercare</a>
                <a href="#suitability">Who may not be suitable</a>
                <a href="#contact">When to contact the clinic</a>
                <a href="#faqs">Frequently asked questions</a>
                <a href="#references">References</a>
              </nav>
            </aside>

            <div className="article-prose">
              <section id="key-takeaways" className="scroll-mt-28 bg-[#F4E8DA] p-6 sm:p-8">
                <h2 className="!mt-0 text-2xl">Key takeaways</h2>
                <ul>
                  {article.keyTakeaways.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              {article.sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <section id="beforecare">
                <h2>Beforecare</h2>
                <ul>
                  {article.beforecare.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section id="aftercare">
                <h2>Aftercare</h2>
                <ul>
                  {article.aftercare.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section id="suitability">
                <h2>Who may not be suitable</h2>
                <p>
                  Suitability depends on individual assessment. Treatment may be delayed, modified,
                  or replaced when any of the following applies:
                </p>
                <ul>
                  {article.unsuitable.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section id="contact">
                <h2>When to contact the clinic</h2>
                <p>Contact ESCLARE promptly for an unexpected or worsening reaction, including:</p>
                <ul>
                  {article.contactClinic.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section id="faqs">
                <h2>Frequently asked questions</h2>
                <div className="mt-5 divide-y divide-[#D8C9B4] border-y border-[#D8C9B4]">
                  {article.faqs.map((faq) => (
                    <details key={faq.question} className="group py-4">
                      <summary className="min-h-11 cursor-pointer content-center font-semibold text-[#481827] marker:text-[#B98A4D]">
                        {faq.question}
                      </summary>
                      <p className="pb-2 pr-5">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
              <section id="references">
                <h2>References</h2>
                <ol className="mt-5 grid gap-3 text-sm">
                  {article.references.map((reference) => (
                    <li key={reference.url}>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#6F263D] underline decoration-[#B98A4D] underline-offset-4"
                      >
                        {reference.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
              <div className="mt-12 border-y border-[#B98A4D]/50 py-6 text-sm leading-7 text-[#62595C]">
                <strong className="text-[#481827]">Medical-information disclaimer:</strong> This
                article is general education only. It does not diagnose, prescribe, confirm
                eligibility, or replace a consultation. Treatment and medicine decisions require an
                appropriately qualified professional.
              </div>
            </div>
          </div>
        </div>
      </article>

      <section
        className="border-y border-[#D8C9B4] bg-white py-12"
        aria-labelledby="related-treatment-heading"
      >
        <div className="public-container">
          <h2 id="related-treatment-heading" className="text-3xl text-[#481827]">
            Related ESCLARE services
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {article.relatedTreatments.map((treatment) => (
              <Link
                key={treatment.href}
                href={treatment.href as Route}
                className="luxury-button-outline"
              >
                {treatment.label} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12" aria-labelledby="related-articles-heading">
          <div className="public-container">
            <h2 id="related-articles-heading" className="text-3xl text-[#481827]">
              Continue learning
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/skin-education/${item.slug}` as Route}
                  className="flex min-h-28 items-center justify-between gap-5 border-l border-[#B98A4D] bg-white p-5 text-[#481827] transition-colors hover:bg-[#F4E8DA]"
                >
                  <span className="font-serif text-xl">{item.title}</span>
                  <ArrowRight className="shrink-0" size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#3B0D14] py-14 text-white">
        <div className="public-container flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B078]">
              Naga or Daet
            </p>
            <h2 className="mt-3 text-3xl">Discuss what is appropriate for you.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E6D6CC]">
              Submit a preferred date and time. Your request remains pending until ESCLARE confirms
              availability.
            </p>
          </div>
          <Link href="/appointment-request" className="luxury-button-light shrink-0">
            <CalendarDays size={17} aria-hidden="true" /> Request consultation
          </Link>
        </div>
      </section>

      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
        />
      )}
    </main>
  );
}
