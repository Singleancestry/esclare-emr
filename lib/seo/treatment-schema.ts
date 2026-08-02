import { type Treatment } from "@/lib/services/catalog";
import { type TreatmentDetail } from "@/lib/services/details";
import { organizationId, siteUrl } from "@/lib/seo/site";

function offers(treatment: Treatment) {
  if (treatment.priceKind === "assessment" || treatment.priceMin === undefined) return undefined;

  const base = {
    "@type": "Offer",
    priceCurrency: "PHP",
    availability: "https://schema.org/InStock",
    url: `${siteUrl}/treatments/${treatment.slug}`,
  };

  if (treatment.priceKind === "fixed" && treatment.priceMax === undefined) {
    return { ...base, price: treatment.priceMin };
  }

  return {
    ...base,
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "PHP",
      minPrice: treatment.priceMin,
      ...(treatment.priceMax === undefined ? {} : { maxPrice: treatment.priceMax }),
      ...(treatment.unit ? { unitText: treatment.unit } : {}),
    },
  };
}

export function buildTreatmentSchema(treatment: Treatment, detail: TreatmentDetail) {
  const url = `${siteUrl}/treatments/${treatment.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalProcedure", "Service"],
        "@id": `${url}#treatment`,
        name: treatment.name,
        url,
        description: treatment.summary,
        category: treatment.category,
        howPerformed: detail.howItWorks,
        preparation: detail.beforecare.join(" "),
        followup: detail.aftercare.join(" "),
        provider: { "@id": organizationId },
        availableAtOrFrom: [
          { "@id": `${siteUrl}/branches/naga#clinic` },
          { "@id": `${siteUrl}/branches/daet#clinic` },
        ],
        areaServed: [
          { "@type": "AdministrativeArea", name: "Camarines Sur" },
          { "@type": "AdministrativeArea", name: "Camarines Norte" },
        ],
        offers: offers(treatment),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: detail.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Treatments", item: `${siteUrl}/treatments` },
          { "@type": "ListItem", position: 3, name: treatment.name, item: url },
        ],
      },
    ],
  };
}
