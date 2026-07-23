import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { BranchProvider } from "@/components/public/branch-provider";
import { FloatingMessenger } from "@/components/public/floating-messenger";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ESCLARE Aesthetic & Wellness Clinic",
      url: siteUrl,
      email: "esclarenaga@gmail.com",
      sameAs: [
        "https://www.facebook.com/EsclareLaserCenter/",
        "https://www.facebook.com/esclaredaet/",
      ],
    },
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": `${siteUrl}/branches#naga`,
      parentOrganization: { "@id": `${siteUrl}/#organization` },
      name: "ESCLARE Naga",
      telephone: "+639207351379",
      priceRange: "PHP 399-37800",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Elias Angeles Street corner Paz Street",
        addressLocality: "Naga City",
        addressCountry: "PH",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "10:00",
          closes: "19:00",
        },
      ],
    },
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": `${siteUrl}/branches/daet#clinic`,
      url: `${siteUrl}/branches/daet`,
      parentOrganization: { "@id": `${siteUrl}/#organization` },
      name: "ESCLARE Daet",
      telephone: "+639391421928",
      priceRange: "PHP 399-37800",
      address: {
        "@type": "PostalAddress",
        streetAddress: "J. Lukban Street",
        addressLocality: "Daet",
        addressRegion: "Camarines Norte",
        addressCountry: "PH",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "09:30",
          closes: "18:00",
        },
      ],
    },
  ],
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <BranchProvider>
      <div className="public-site">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <div id="main-content" tabIndex={-1} className="page-enter">
          {children}
        </div>
        <SiteFooter />
        <FloatingMessenger />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      </div>
    </BranchProvider>
  );
}
