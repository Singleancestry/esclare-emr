import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  if (process.env.VERCEL_ENV === "preview") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/admin",
          "/patients",
          "/clinical",
          "/finance",
          "/settings",
          "/lock",
          "/forgot-password",
          "/update-password",
          "/login",
          "/auth/",
          "/appointments/",
          "/clinical/",
          "/employees/",
          "/finance/",
          "/integrations/",
          "/inventory/",
          "/marketing/",
          "/packages/",
          "/pos/",
          "/reports/",
          "/services/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
