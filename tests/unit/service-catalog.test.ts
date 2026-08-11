import { describe, expect, it } from "vitest";
import {
  diodePackages,
  formatTreatmentPrice,
  GLP1_PROGRAM_LABEL,
  treatments,
} from "@/lib/services/catalog";
import { treatmentNavigationItems } from "@/lib/services/treatment-navigation";

describe("service catalog", () => {
  it("formats fixed, ranged and starting prices without inventing promotions", () => {
    expect(formatTreatmentPrice(treatments.find((item) => item.slug === "korean-facial")!)).toBe(
      "₱1,800 / session",
    );
    expect(formatTreatmentPrice(treatments.find((item) => item.slug === "acne-cleanse")!)).toBe(
      "₱499-₱599 / session",
    );
    expect(
      formatTreatmentPrice(treatments.find((item) => item.slug === "laser-circumcision")!),
    ).toBe("Starts at ₱5,000");
  });

  it("keeps the GLP-1 program duration canonical without a price headline", () => {
    const treatment = treatments.find((item) => item.slug === "glp-1-slimming")!;

    expect(formatTreatmentPrice(treatment)).toBe(GLP1_PROGRAM_LABEL);
    expect(GLP1_PROGRAM_LABEL).toBe("Physician-supervised 4-week GLP-1 treatment program");
  });

  it("keeps MCCM public, Rejuran hidden, and all approved Skin Support prices unchanged", () => {
    const skinSupport = treatments.filter((item) => item.category === "Skin Support");

    expect(skinSupport).toHaveLength(7);
    expect(skinSupport.every((item) => item.publicationStatus === "regulatory-review")).toBe(true);
    expect(skinSupport.filter((item) => item.public).map((item) => item.slug)).toEqual([
      "mccm-exosome-pdrn",
      "mccm-eye-contour",
      "mccm-brightening-system",
      "mccm-glass-skin-booster",
    ]);
    expect(Object.fromEntries(skinSupport.map((item) => [item.slug, item.priceMin]))).toEqual({
      "mccm-exosome-pdrn": 4000,
      "mccm-eye-contour": 3800,
      "mccm-brightening-system": 5000,
      "mccm-glass-skin-booster": 4000,
      "rejuran-h": 25000,
      "rejuran-eye": 15000,
      "rejuran-scar": 15000,
    });
  });

  it("preserves every pre-audit treatment price field", () => {
    const expected: Record<string, [string, number | null, number | null, string | null]> = {
      "korean-facial": ["fixed", 1800, null, "session"],
      "hydrajet-peel": ["fixed", 1999, null, "session"],
      "esthemax-hydrojelly-mask": ["fixed", 350, null, "add-on"],
      "intense-hydrating": ["fixed", 2000, null, "session"],
      "basic-detox": ["fixed", 399, null, "session"],
      exfoliare: ["fixed", 499, null, "session"],
      "exfoliare-cryo": ["fixed", 599, null, "session"],
      "acne-cleanse": ["range", 499, 599, "session"],
      "pico-glow-face": ["fixed", 3500, null, "session"],
      "pico-glow-body": ["fixed", 2000, null, "area/session"],
      "carbon-laser-peel": ["fixed", 3500, null, "session"],
      "tattoo-removal": ["starts_at", 1200, null, null],
      "exilift-face": ["fixed", 1800, null, "session"],
      "7d-hifu-face": ["fixed", 4999, null, "session"],
      armtox: ["fixed", 17000, null, null],
      sweatox: ["fixed", 15000, null, null],
      jawtox: ["fixed", 10000, null, null],
      "fine-lines": ["fixed", 250, null, "unit"],
      "hiko-nose-lift": ["assessment", null, null, null],
      "pdo-threads": ["fixed", 12000, null, null],
      "rejuran-h": ["fixed", 25000, null, null],
      "rejuran-eye": ["fixed", 15000, null, null],
      "rejuran-scar": ["fixed", 15000, null, null],
      "fractional-laser": ["range", 4000, 7000, null],
      "mccm-exosome-pdrn": ["starts_at", 4000, null, "session"],
      "mccm-eye-contour": ["fixed", 3800, null, "session"],
      "mccm-brightening-system": ["starts_at", 5000, null, "session"],
      "glp-1-slimming": ["fixed", 21500, null, "4-week treatment program"],
      "hikari-drip": ["fixed", 3000, null, "session"],
      "zaguta-drip": ["fixed", 2100, null, "session"],
      "laser-circumcision": ["starts_at", 5000, null, null],
    };

    for (const [slug, price] of Object.entries(expected)) {
      const treatment = treatments.find((item) => item.slug === slug);
      expect(treatment, slug).toBeDefined();
      expect(
        [
          treatment!.priceKind,
          treatment!.priceMin ?? null,
          treatment!.priceMax ?? null,
          treatment!.unit ?? null,
        ],
        slug,
      ).toEqual(price);
    }
  });

  it("keeps product links out of the first-level Treatments navigation", () => {
    expect(treatmentNavigationItems.map((item) => item.label)).toEqual([
      "All Treatments",
      "Facial",
      "Laser Brightening / Laser Treatments",
      "4D Diode",
      "Lifting",
      "Doctor Procedures",
      "Wellness",
      "Skin Support",
    ]);
    expect(treatmentNavigationItems.some((item) => /MCCM|Rejuran/.test(item.label))).toBe(false);
  });

  it("matches the approved 4D wavelength diode price list exactly", () => {
    const approvedPrices = {
      Face: [2000, 3600, 5400, 7200, 9000, 10800],
      "Upper Lip": [900, 1620, 2430, 3240, 4050, 4860],
      "Lower Lip": [900, 1620, 2430, 3240, 4050, 4860],
      "Full Beard": [1800, 3240, 4860, 6480, 8100, 9720],
      Underarms: [1500, 2700, 4050, 5400, 6750, 8100],
      "Full Arms": [2300, 4140, 6210, 8280, 10350, 12420],
      Chest: [4500, 8100, 12150, 16200, 20250, 24300],
      "Full Back": [5000, 9000, 13500, 18000, 22500, 27000],
      Navel: [1500, 2700, 4050, 5400, 6750, 8100],
      Brazilian: [3000, 5400, 8100, 10800, 13500, 16200],
      "Bikini Line": [1800, 3240, 4860, 6480, 8100, 9720],
      "Upper Legs": [3900, 7020, 10530, 14040, 17550, 21060],
      "Lower Legs": [4200, 7560, 11340, 15120, 18900, 22680],
      "Full Legs": [7000, 12600, 18900, 25200, 31500, 37800],
    };

    expect(diodePackages).toHaveLength(14);
    expect(
      diodePackages.every(
        (item) => item.options.map((option) => option.sessions).join(",") === "1,2,3,4,5,6",
      ),
    ).toBe(true);
    expect(
      Object.fromEntries(
        diodePackages.map((item) => [item.area, item.options.map((option) => option.price)]),
      ),
    ).toEqual(approvedPrices);
  });
});
