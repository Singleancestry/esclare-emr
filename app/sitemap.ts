import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
  return ["/home", "/treatments", "/diode-laser", "/gallery", "/appointment-request", "/branches", "/about", "/faq", "/contact", "/privacy", "/terms"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: path === "/home" ? "weekly" : "monthly", priority: path === "/home" ? 1 : path === "/appointment-request" ? 0.9 : 0.7 }));
}
