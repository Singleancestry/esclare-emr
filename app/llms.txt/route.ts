import { clinicBranches } from "@/lib/clinic/details";
import { BUSINESS_NAME } from "@/lib/clinic/brand";
import { educationCategories } from "@/lib/content/skin-education";
import { formatTreatmentPrice, treatments } from "@/lib/services/catalog";
import { siteUrl } from "@/lib/seo/site";

export const dynamic = "force-static";

export function GET() {
  const publicTreatments = treatments.filter(
    (treatment) => treatment.public && treatment.publicationStatus !== "regulatory-review",
  );

  const branchLines = clinicBranches.flatMap((branch) => [
    `### ${branch.name}`,
    `- Address: ${branch.address}`,
    `- Phone: ${branch.phone}`,
    `- Hours: ${branch.schedule}`,
    `- Page: ${siteUrl}/branches/${branch.code}`,
    "",
  ]);

  const treatmentLines = publicTreatments.map(
    (treatment) =>
      `- [${treatment.name}](${siteUrl}/treatments/${treatment.slug}) — ${treatment.category}. ${treatment.summary} Price: ${formatTreatmentPrice(treatment)}.`,
  );

  const body = [
    `# ${BUSINESS_NAME}`,
    "",
    "> Aesthetic, laser, and wellness clinic with two branches in the Bicol Region, Philippines:",
    "> Naga City (Camarines Sur) and Daet (Camarines Norte). Treatments include facials, pico and",
    "> diode laser, HIFU, injectables, skin boosters, IV drips, and a medically supervised GLP-1",
    "> weight-management program. Appointments are requests until the clinic confirms; no booking",
    "> deposit is required.",
    "",
    "## Branches",
    "",
    ...branchLines,
    "## Key pages",
    "",
    `- [Home](${siteUrl}/)`,
    `- [All treatments and prices](${siteUrl}/treatments)`,
    `- [GLP-1 Slimming program](${siteUrl}/glp-1-slimming)`,
    `- [Diode laser hair removal packages](${siteUrl}/diode-laser)`,
    `- [Request an appointment](${siteUrl}/appointment-request)`,
    `- [Frequently asked questions](${siteUrl}/faq)`,
    `- [Aftercare guidance](${siteUrl}/aftercare)`,
    `- [About the clinic](${siteUrl}/about)`,
    `- [Contact](${siteUrl}/contact)`,
    "",
    "## Treatments",
    "",
    ...treatmentLines,
    "",
    "## Skin education",
    "",
    ...educationCategories.map(
      (category) => `- [${category.name}](${siteUrl}/skin-education/category/${category.slug})`,
    ),
    "",
    "## Notes",
    "",
    "- Prices are listed in Philippine pesos and may change; the treatment pages are authoritative.",
    "- Doctor-required procedures need a consultation, and suitability is confirmed only after assessment.",
    "- No treatment outcome, session count, or result duration is guaranteed.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
