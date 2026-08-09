import { describe, expect, it } from "vitest";
import { clinicBranches } from "@/lib/clinic/details";
import { organizationSchema } from "@/lib/seo/organization-schema";
import { buildTreatmentSchema } from "@/lib/seo/treatment-schema";
import { treatments } from "@/lib/services/catalog";
import { getTreatmentDetail } from "@/lib/services/details";

type SchemaNode = Record<string, unknown>;

const graph = organizationSchema["@graph"] as ReadonlyArray<SchemaNode>;
const clinics = graph.filter((node) => String(node["@type"]).includes("MedicalClinic"));

function schemaFor(slug: string) {
  const treatment = treatments.find((item) => item.slug === slug)!;
  const nodes = buildTreatmentSchema(treatment, getTreatmentDetail(treatment))[
    "@graph"
  ] as ReadonlyArray<SchemaNode>;
  return Object.fromEntries(nodes.map((node) => [String(node["@type"]), node]));
}

describe("organization schema", () => {
  it("publishes one clinic node per branch with a map link and phone", () => {
    expect(clinics).toHaveLength(clinicBranches.length);
    expect(clinics.map((clinic) => clinic.name)).toEqual(
      clinicBranches.map((branch) => branch.name),
    );
    expect(clinics.map((clinic) => clinic.telephone)).toEqual(
      clinicBranches.map((branch) => branch.phoneHref),
    );
    expect(clinics.map((clinic) => clinic.hasMap)).toEqual(
      clinicBranches.map((branch) => branch.maps),
    );
  });

  it("derives opening hours from operatingHours so Monday closures are never advertised", () => {
    for (const clinic of clinics) {
      const spec = clinic.openingHoursSpecification as ReadonlyArray<{ dayOfWeek: string[] }>;
      const days = spec.flatMap((entry) => entry.dayOfWeek);

      expect(days).not.toContain("Monday");
      expect(days).toHaveLength(6);
    }
  });

  it("keeps the organization node addressable by treatment pages", () => {
    const organization = graph.find((node) => node["@type"] === "Organization")!;

    expect(organization["@id"]).toMatch(/#organization$/);
    expect(organization.sameAs).toEqual(
      expect.arrayContaining(clinicBranches.map((b) => b.facebook)),
    );
  });
});

describe("treatment schema", () => {
  it("emits a fixed price for single-price treatments", () => {
    const offer = schemaFor("7d-hifu-face")["MedicalProcedure,Service"].offers as SchemaNode;

    expect(offer.price).toBe(4999);
    expect(offer.priceCurrency).toBe("PHP");
  });

  it("emits a price range for ranged and starting-price treatments", () => {
    const ranged = schemaFor("acne-cleanse")["MedicalProcedure,Service"].offers as SchemaNode;
    const startsAt = schemaFor("laser-circumcision")["MedicalProcedure,Service"]
      .offers as SchemaNode;

    expect(ranged.priceSpecification).toMatchObject({ minPrice: 499, maxPrice: 599 });
    expect(startsAt.priceSpecification).toMatchObject({ minPrice: 5000 });
    expect((startsAt.priceSpecification as SchemaNode).maxPrice).toBeUndefined();
  });

  it("mirrors the on-page FAQs and breadcrumb trail", () => {
    const treatment = treatments.find((item) => item.slug === "7d-hifu-face")!;
    const detail = getTreatmentDetail(treatment);
    const nodes = schemaFor("7d-hifu-face");

    expect((nodes.FAQPage.mainEntity as unknown[]).length).toBe(detail.faqs.length);
    expect(
      (nodes.BreadcrumbList.itemListElement as ReadonlyArray<{ name: string }>).map((i) => i.name),
    ).toEqual(["Home", "Treatments", "HIFU"]);
  });
});
