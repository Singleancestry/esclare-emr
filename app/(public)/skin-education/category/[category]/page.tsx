import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EducationArticleCard } from "@/components/public/education-article-card";
import {
  educationCategories,
  getCategoryArticles,
  getEducationCategory,
} from "@/lib/content/skin-education";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return educationCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getEducationCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} Skin Education`,
    description: category.description,
    alternates: { canonical: `/skin-education/category/${category.slug}` },
  };
}

export default async function EducationCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getEducationCategory(slug);
  if (!category) notFound();
  const includeDrafts = process.env.NODE_ENV !== "production";
  const articles = getCategoryArticles(category.slug, includeDrafts);

  return (
    <main>
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-14 sm:py-20">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
            <Link href="/home">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href={"/skin-education" as Route}>Skin Education</Link>{" "}
            <span aria-hidden="true">/</span> <span aria-current="page">{category.name}</span>
          </nav>
          <p className="public-eyebrow mt-9">Skin Education category</p>
          <h1 className="public-heading mt-4 max-w-4xl">{category.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#62595C]">
            {category.description}
          </p>
          {category.slug === "mccm-skin-science" && (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6F263D]">
              MCCM articles explain professional ingredients and protocols; they do not imply that
              every product is suitable for every client.
            </p>
          )}
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="public-container">
          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <EducationArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="border-y border-[#D8C9B4] py-16 text-center">
              <h2 className="text-2xl text-[#481827]">Articles are awaiting clinical review.</h2>
              <p className="mt-3 text-sm text-[#62595C]">
                Contact ESCLARE for current guidance while this category is prepared for
                publication.
              </p>
              <Link href="/appointment-request" className="luxury-button mt-6">
                Request consultation
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
