import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { EducationArticle } from "@/lib/content/skin-education";
import { educationCategories } from "@/lib/content/skin-education";

type ArticlePreview = Pick<
  EducationArticle,
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "heroImage"
  | "heroAlt"
  | "readingMinutes"
  | "updatedAt"
  | "status"
>;

export function EducationArticleCard({ article }: { article: ArticlePreview }) {
  const category = educationCategories.find((item) => item.slug === article.category);

  return (
    <article className="education-card group grid min-h-full grid-rows-[auto_1fr] overflow-hidden">
      <Link
        href={`/skin-education/${article.slug}` as Route}
        aria-label={`Read ${article.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#E9DED1]"
      >
        <Image
          src={article.heroImage}
          alt={article.heroAlt}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 94vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
        />
      </Link>
      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold text-[#765A44]">
          <span className="rounded-md bg-[#F0E5D8] px-2.5 py-1">{category?.name}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} aria-hidden="true" /> {article.readingMinutes} min read
          </span>
          {article.status === "medical-review-required" && (
            <span className="rounded-md border border-[#B98A4D]/60 px-2.5 py-1 text-[#6F263D]">
              Review draft
            </span>
          )}
        </div>
        <h2 className="mt-4 text-[clamp(1.35rem,2vw,1.75rem)] leading-tight text-[#481827]">
          <Link href={`/skin-education/${article.slug}` as Route}>{article.title}</Link>
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#62595C]">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs text-[#746A6D]">
          <time dateTime={article.updatedAt}>
            Updated{" "}
            {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(
              new Date(article.updatedAt),
            )}
          </time>
          <Link
            href={`/skin-education/${article.slug}` as Route}
            className="inline-flex min-h-11 items-center gap-1.5 font-bold text-[#6F263D]"
          >
            Read <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
