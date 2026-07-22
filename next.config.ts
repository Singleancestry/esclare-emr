import type { NextConfig } from "next";

const scriptSources =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://www.facebook.com https://m.me",
  "frame-ancestors 'none'",
  "object-src 'none'",
  scriptSources,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const noStorePageHeaders = [
  {
    key: "Cache-Control",
    value: "private, no-store, no-cache, must-revalidate, max-age=0",
  },
];

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
