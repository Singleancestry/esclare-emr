import type { Metadata } from "next";
import { BUSINESS_NAME } from "@/lib/clinic/brand";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: BUSINESS_NAME, template: `%s | ${BUSINESS_NAME}` },
  description:
    "Premium aesthetic and wellness care in Naga City and Daet, with thoughtful assessment and clear treatment guidance.",
  robots: isPreviewDeployment
    ? { index: false, follow: false, noarchive: true, noimageindex: true }
    : undefined,
  openGraph: {
    type: "website",
    siteName: BUSINESS_NAME,
    title: BUSINESS_NAME,
    description: "Premium aesthetic and wellness care in Naga City and Daet.",
    images: [
      {
        url: "/og-esclare.jpg",
        width: 1200,
        height: 630,
        alt: `${BUSINESS_NAME} in Naga and Daet`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS_NAME,
    description: "Premium aesthetic and wellness care in Naga City and Daet.",
    images: ["/og-esclare.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
