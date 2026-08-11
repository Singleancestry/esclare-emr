import { clinicBranches, type ClinicBranch } from "@/lib/clinic/details";
import { BUSINESS_NAME } from "@/lib/clinic/brand";
import { organizationId, siteUrl } from "@/lib/seo/site";

const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const postalAddress: Record<ClinicBranch["code"], Record<string, string>> = {
  naga: {
    streetAddress: "Elias Angeles Street corner Paz Street",
    addressLocality: "Naga City",
    addressRegion: "Camarines Sur",
    postalCode: "4400",
    addressCountry: "PH",
  },
  daet: {
    streetAddress: "J. Lukban Street",
    addressLocality: "Daet",
    addressRegion: "Camarines Norte",
    addressCountry: "PH",
  },
};

function clockTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// Group open days that share the same window so the emitted hours stay in sync
// with `operatingHours`, which also drives the visible schedule and booking checks.
function openingHoursSpecification(branch: ClinicBranch) {
  const windows = new Map<string, string[]>();
  for (const [index, hours] of Object.entries(branch.operatingHours)) {
    if (!hours) continue;
    const key = `${clockTime(hours.opens)}-${clockTime(hours.closes)}`;
    const days = windows.get(key) ?? [];
    days.push(SCHEMA_DAYS[Number(index)]);
    windows.set(key, days);
  }

  return Array.from(windows.entries()).map(([key, dayOfWeek]) => {
    const [opens, closes] = key.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes };
  });
}

function branchNode(branch: ClinicBranch) {
  return {
    "@type": ["MedicalClinic", "HealthAndBeautyBusiness"],
    "@id": `${siteUrl}/branches/${branch.code}#clinic`,
    url: `${siteUrl}/branches/${branch.code}`,
    parentOrganization: { "@id": organizationId },
    name: branch.name,
    telephone: branch.phoneHref,
    image: `${siteUrl}/og-esclare.jpg`,
    priceRange: "PHP 399-37800",
    currenciesAccepted: "PHP",
    paymentAccepted: "Cash, Credit Card, Debit Card, GCash, Bank Transfer",
    hasMap: branch.maps,
    sameAs: [branch.facebook],
    address: { "@type": "PostalAddress", ...postalAddress[branch.code] },
    areaServed: {
      "@type": "AdministrativeArea",
      name: postalAddress[branch.code].addressRegion,
    },
    openingHoursSpecification: openingHoursSpecification(branch),
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: BUSINESS_NAME,
      url: siteUrl,
      email: "esclarenaga@gmail.com",
      logo: `${siteUrl}/og-esclare.jpg`,
      image: `${siteUrl}/og-esclare.jpg`,
      telephone: clinicBranches[0].phoneHref,
      sameAs: [
        ...clinicBranches.map((branch) => branch.facebook),
        "https://www.youtube.com/channel/UCZY6USbfDyb44KVJWZlzUsA",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BUSINESS_NAME,
      inLanguage: "en-PH",
      publisher: { "@id": organizationId },
    },
    ...clinicBranches.map(branchNode),
  ],
};
