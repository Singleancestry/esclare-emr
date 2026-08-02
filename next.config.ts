import type { NextConfig } from "next";

const canonicalHost = (() => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (!siteUrl) return null;
  try {
    return new URL(siteUrl).host;
  } catch {
    return null;
  }
})();

const scriptSources =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://challenges.cloudflare.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://challenges.cloudflare.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://www.facebook.com https://m.me",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "frame-src https://challenges.cloudflare.com",
  scriptSources,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.facebook.com",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://www.facebook.com https://connect.facebook.net https://challenges.cloudflare.com",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const noStorePageHeaders = [
  {
    key: "Cache-Control",
    value: "private, no-store, no-cache, must-revalidate, max-age=0",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
];

const previewPageHeaders =
  process.env.VERCEL_ENV === "preview"
    ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
    : [];

const privatePageRoutes = [
  "/login",
  "/lock",
  "/forgot-password",
  "/update-password",
  "/auth/:path*",
  "/admin/:path*",
  "/appointments/:path*",
  "/clinical/:path*",
  "/dashboard/:path*",
  "/employees/:path*",
  "/finance/:path*",
  "/integrations/:path*",
  "/inventory/:path*",
  "/marketing/:path*",
  "/packages/:path*",
  "/patients/:path*",
  "/pos/:path*",
  "/reports/:path*",
  "/services/:path*",
  "/settings/:path*",
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Collapse the www host onto the canonical host used by metadata and the sitemap,
      // so both do not serve 200 for every URL.
      ...(canonicalHost && !canonicalHost.startsWith("www.")
        ? [
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: `www.${canonicalHost}` }],
              destination: `https://${canonicalHost}/:path*`,
              permanent: true,
            },
          ]
        : []),
      {
        source: "/treatments/skin-support/mccm-exosome-pdrn",
        destination: "/treatments/mccm-exosome-pdrn",
        permanent: true,
      },
      {
        source: "/treatments/skin-support/mccm-eye-contour",
        destination: "/treatments/mccm-eye-contour",
        permanent: true,
      },
      {
        source: "/treatments/skin-support/mccm-brightening-system",
        destination: "/treatments/mccm-brightening-system",
        permanent: true,
      },
      {
        source: "/treatments/skin-support/rejuran-healer",
        destination: "/treatments/rejuran-h",
        permanent: true,
      },
      {
        source: "/treatments/skin-support/rejuran-eye",
        destination: "/treatments/rejuran-eye",
        permanent: true,
      },
      {
        source: "/treatments/skin-support/rejuran-s",
        destination: "/treatments/rejuran-scar",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      ...privatePageRoutes.map((source) => ({
        source,
        headers: noStorePageHeaders,
      })),
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          ...previewPageHeaders,
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
        ],
      },
    ];
  },
};

export default nextConfig;
