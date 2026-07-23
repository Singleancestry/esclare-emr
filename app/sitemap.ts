import type { MetadataRoute } from "next";
import { educationArticles, educationCategories } from "@/lib/content/skin-education";
import { treatments } from "@/lib/services/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  const staticPaths = [
    "/home",
    "/treatments",
    "/glp-1-slimming",
    "/skin-education",
    "/diode-laser",
    "/gallery",
    "/appointment-request",
    "/branches",
    "/branches/daet",
    "/about",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ];
  const treatmentPaths = treatments
    .filter((treatment) => treatment.public)
    .map((treatment) => `/treatments/${treatment.slug}`);
  const educationCategoryPaths = educationCategories.map(
    (category) => `/skin-education/category/${category.slug}`,
  );
  const approvedArticlePaths = educationArticles
    .filter((article) => article.published)
    .map((article) => `/skin-education/${article.slug}`);

  return [
    ...staticPaths,
    ...treatmentPaths,
    ...educationCategoryPaths,
    ...approvedArticlePaths,
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/home" ? "weekly" : "monthly",
    priority:
      path === "/home"
        ? 1
        : path === "/appointment-request"
          ? 0.9
          : path === "/branches/daet"
            ? 0.8
            : 0.7,
  }));
}
