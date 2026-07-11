import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000"),
  title: { default: "ESCLARE Aesthetic & Wellness Clinic", template: "%s | ESCLARE" },
  description: "Premium aesthetic and wellness care in Naga City and Daet, with thoughtful assessment and clear treatment guidance.",
  openGraph: { type: "website", siteName: "ESCLARE Aesthetic & Wellness Clinic", title: "ESCLARE Aesthetic & Wellness Clinic", description: "Premium aesthetic and wellness care in Naga City and Daet.", images: [{ url: "/images/optimized/clinic/esclare-naga-hero-1800.webp", width: 1800, height: 1000, alt: "The authentic ESCLARE Naga logo wall and chandelier" }] },
  twitter: { card: "summary_large_image", title: "ESCLARE Aesthetic & Wellness Clinic", description: "Premium aesthetic and wellness care in Naga City and Daet.", images: ["/images/optimized/clinic/esclare-naga-hero-1800.webp"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
