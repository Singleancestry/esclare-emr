import { describe, expect, it } from "vitest";
import {
  educationArticles,
  educationCategories,
  getCategoryArticles,
  getVisibleEducationArticles,
} from "@/lib/content/skin-education";
import { treatments } from "@/lib/services/catalog";
import { getTreatmentDetail } from "@/lib/services/details";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("skin education editorial controls", () => {
  it("contains the complete requested article library with unique metadata", () => {
    expect(educationArticles).toHaveLength(15);
    expect(new Set(educationArticles.map((article) => article.slug)).size).toBe(15);
    expect(new Set(educationArticles.map((article) => article.seoTitle)).size).toBe(15);
    expect(educationArticles.every((article) => article.faqs.length >= 5)).toBe(true);
  });

  it("does not expose Rejuran education content", () => {
    const rejuranDrafts = educationArticles.filter((article) => article.tags.includes("Rejuran"));

    expect(rejuranDrafts).toHaveLength(0);
  });

  it("publishes supplied editorial articles while keeping review-gated content hidden", () => {
    const visible = getVisibleEducationArticles();

    expect(visible).toHaveLength(15);
    expect(visible.every((article) => article.published && article.status === "published")).toBe(
      true,
    );
    expect(visible.some((article) => article.slug === "esthemax-hydrojelly-mask-guide")).toBe(true);
    expect(visible.some((article) => article.tags.includes("Rejuran"))).toBe(false);
  });

  it("rejects draft slugs that were not generated for production", () => {
    const routeSource = readFileSync(
      resolve(process.cwd(), "app/(public)/skin-education/[slug]/page.tsx"),
      "utf8",
    );

    expect(routeSource).toContain("export const dynamicParams = false");
    expect(routeSource).toContain('process.env.NODE_ENV !== "production"');
  });

  it("populates production landing and category pages with non-clickable draft previews", () => {
    const landingSource = readFileSync(
      resolve(process.cwd(), "app/(public)/skin-education/page.tsx"),
      "utf8",
    );
    const categorySource = readFileSync(
      resolve(process.cwd(), "app/(public)/skin-education/category/[category]/page.tsx"),
      "utf8",
    );

    expect(landingSource).toContain("getVisibleEducationArticles(true)");
    expect(landingSource).toContain("linkEnabled={false}");
    expect(categorySource).toContain("getCategoryArticles(category.slug, true)");
    expect(categorySource).toContain("linkEnabled={article.published}");
  });

  it("covers all education categories in preview mode", () => {
    for (const category of educationCategories) {
      expect(getCategoryArticles(category.slug, true).length).toBeGreaterThan(0);
    }
  });
});

describe("treatment guide coverage", () => {
  it("provides complete supporting content for every public treatment", () => {
    const publicTreatments = treatments.filter((treatment) => treatment.public);

    expect(publicTreatments.length).toBeGreaterThan(0);
    for (const treatment of publicTreatments) {
      const detail = getTreatmentDetail(treatment);
      expect(detail.concerns.length).toBeGreaterThan(0);
      expect(detail.beforecare.length).toBeGreaterThanOrEqual(3);
      expect(detail.aftercare.length).toBeGreaterThanOrEqual(3);
      expect(detail.faqs.length).toBeGreaterThanOrEqual(5);
    }
  });
});
