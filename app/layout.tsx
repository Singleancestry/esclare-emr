import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ESCLARE Aesthetic & Wellness Clinic", template: "%s | ESCLARE" },
  description:
    "Premium aesthetic and wellness care in Naga City and Daet, with thoughtful assessment and clear treatment guidance.",
  openGraph: {
    type: "website",
    siteName: "ESCLARE Aesthetic & Wellness Clinic",
    title: "ESCLARE Aesthetic & Wellness Clinic",
    description: "Premium aesthetic and wellness care in Naga City and Daet.",
    images: [
      {
        url: "/og-esclare.jpg",
        width: 1200,
        height: 630,
        alt: "ESCLARE Aesthetic and Wellness in Naga and Daet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESCLARE Aesthetic & Wellness Clinic",
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
