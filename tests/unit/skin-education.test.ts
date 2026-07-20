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
    expect(educationArticles).toHaveLength(14);
    expect(new Set(educationArticles.map((article) => article.slug)).size).toBe(14);
    expect(new Set(educationArticles.map((article) => article.seoTitle)).size).toBe(14);
    expect(educationArticles.every((article) => article.faqs.length >= 5)).toBe(true);
  });

  it("keeps unreviewed medical content out of production visibility", () => {
    expect(getVisibleEducationArticles()).toEqual([]);
    expect(
      educationArticles.every(
        (article) =>
          !article.published &&
          article.status === "medical-review-required" &&
          article.reviewer === null,
      ),
    ).toBe(true);
  });

  it("rejects draft slugs that were not generated for production", () => {
    const routeSource = readFileSync(
      resolve(process.cwd(), "app/(public)/skin-education/[slug]/page.tsx"),
      "utf8",
    );

    expect(routeSource).toContain("export const dynamicParams = false");
    expect(routeSource).toContain('process.env.NODE_ENV !== "production"');
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
