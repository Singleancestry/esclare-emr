import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { treatments } from "@/lib/services/catalog";

const migration = readFileSync(
  "supabase/migrations/202608111200_additive_treatment_catalog.sql",
  "utf8",
).toLowerCase();

const addedSlugs = [
  "facial-treatment-add-ons",
  "botox-facial",
  "back-acne-care",
  "acne-care-pdt",
  "pico-spot-treatment",
  "hifu-exilift-combination",
  "mesotherapy-exilift-contouring",
  "traptox",
  "palmar-hyperhidrosis",
  "cats-eye-eyebrow-lift",
  "minor-skin-procedures",
  "rf-microneedling",
  "acne-stub-stop",
  "vascular-treatments",
  "mccm-glass-skin-booster",
] as const;

describe("August 2026 additive treatment audit", () => {
  it("adds each confirmed treatment once without duplicate slugs or names", () => {
    expect(new Set(treatments.map((item) => item.slug)).size).toBe(treatments.length);
    expect(new Set(treatments.map((item) => item.name.toLowerCase())).size).toBe(treatments.length);

    for (const slug of addedSlugs) {
      expect(
        treatments.filter((item) => item.slug === slug),
        slug,
      ).toHaveLength(1);
    }
  });

  it("keeps unresolved vascular classification and pricing out of booking and indexing", () => {
    const vascular = treatments.find((item) => item.slug === "vascular-treatments")!;

    expect(vascular.doctorRequired).toBe(false);
    expect(vascular.assessmentRequired).toBe(true);
    expect(vascular.priceKind).toBe("assessment");
    expect(vascular.publicationStatus).toBe("regulatory-review");
    expect(vascular.areas?.map((item) => item.price)).toEqual([
      "₱3,500 / ml",
      "₱4,000 / session",
      "₱3,000 / session",
    ]);
  });

  it("uses an additive draft database migration and never updates or deletes existing rows", () => {
    expect(migration).toContain("'draft'");
    expect(migration).toContain("on conflict (code) do nothing");
    expect(migration).not.toContain("update public.services");
    expect(migration).not.toContain("update public.service_prices");
    expect(migration).not.toMatch(/delete\s+from\s+public\.(services|service_prices)/);
    expect(migration).not.toContain("60000");
  });
});
