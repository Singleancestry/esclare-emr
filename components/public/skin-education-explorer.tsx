"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { EducationArticleCard } from "@/components/public/education-article-card";
import type { EducationArticle, EducationCategorySlug } from "@/lib/content/skin-education";
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

export function SkinEducationExplorer({ articles }: { articles: ReadonlyArray<ArticlePreview> }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | EducationCategorySlug>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = useMemo(
    () =>
      articles.filter((article) => {
        const inCategory = category === "all" || article.category === category;
        const matchesQuery =
          !deferredQuery ||
          `${article.title} ${article.excerpt}`.toLowerCase().includes(deferredQuery);
        return inCategory && matchesQuery;
      }),
    [articles, category, deferredQuery],
  );

  return (
    <div>
      <div className="grid gap-4 border-y border-[#D8C9B4] py-6 lg:grid-cols-[minmax(16rem,0.42fr)_1fr] lg:items-center">
        <label className="relative block">
          <span className="sr-only">Search Skin Education articles</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A4C]"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search topics"
            className="min-h-12 w-full border border-[#CDBA9F] bg-white py-3 pl-11 pr-4 text-sm text-[#43201E] outline-none transition focus:border-[#6F263D]"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className="education-filter"
          >
            All
          </button>
          {educationCategories.map((item) => (
            <button
              type="button"
              key={item.slug}
              onClick={() => setCategory(item.slug)}
              aria-pressed={category === item.slug}
              className="education-filter"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-[#6B6264]" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
      </p>
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <EducationArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border-y border-[#D8C9B4] py-16 text-center">
          <p className="font-serif text-2xl text-[#481827]">No articles match this search.</p>
          <p className="mt-3 text-sm text-[#62595C]">
            Try another phrase or choose a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="luxury-button-outline mt-6"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
