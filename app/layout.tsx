import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ESCLARE Aesthetic & Wellness Clinic", template: "%s | ESCLARE" },
  description:
    "Premium aesthetic and wellness care in Naga City and Daet, with thoughtful assessment and clear treatment guidance.",
  robots: isPreviewDeployment
    ? { index: false, follow: false, noarchive: true, noimageindex: true }
    : undefined,
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
      <body>
        <Script
          id="google-analytics-loader"
          src="https://www.googletagmanager.com/gtag/js?id=G-RS34GQW8W6"
          strategy="beforeInteractive"
        />
        <Script
          id="google-analytics-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RS34GQW8W6');
            `,
          }}
        />
        <Script
          id="meta-pixel"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2927430460923084');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- Meta requires a raw tracking pixel when JavaScript is disabled. */}
          <img
            alt=""
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2927430460923084&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
