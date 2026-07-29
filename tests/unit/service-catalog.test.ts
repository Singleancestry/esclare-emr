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

  it("keeps the GLP-1 program price and duration canonical", () => {
    const treatment = treatments.find((item) => item.slug === "glp-1-slimming")!;

    expect(formatTreatmentPrice(treatment)).toBe(GLP1_PROGRAM_LABEL);
    expect(GLP1_PROGRAM_LABEL).toBe("GLP-1 Slimming — ₱21,500 for a 4-week treatment program");
  });

  it("keeps all six Skin Support services review-gated with approved preview prices", () => {
    const skinSupport = treatments.filter((item) => item.category === "Skin Support");

    expect(skinSupport).toHaveLength(6);
    expect(skinSupport.every((item) => item.publicationStatus === "regulatory-review")).toBe(true);
    expect(Object.fromEntries(skinSupport.map((item) => [item.slug, item.priceMin]))).toEqual({
      "mccm-exosome-pdrn": 4000,
      "mccm-eye-contour": 3800,
      "mccm-brightening-system": 5000,
      "rejuran-h": 25000,
      "rejuran-eye": 15000,
      "rejuran-scar": 15000,
    });
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
