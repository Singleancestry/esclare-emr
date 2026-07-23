import { describe, expect, it } from "vitest";
import {
  diodePackages,
  formatTreatmentPrice,
  GLP1_PROGRAM_LABEL,
  treatments,
} from "@/lib/services/catalog";

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
    ).toBe("Starts at ₱3,999");
  });

  it("keeps the GLP-1 program price and duration canonical", () => {
    const treatment = treatments.find((item) => item.slug === "glp-1-slimming")!;

    expect(formatTreatmentPrice(treatment)).toBe(GLP1_PROGRAM_LABEL);
    expect(GLP1_PROGRAM_LABEL).toBe("GLP-1 Slimming — ₱21,500 for a 4-week treatment program");
  });

  it("keeps all diode packages complete from two through six sessions", () => {
    expect(diodePackages).toHaveLength(13);
    expect(
      diodePackages.every(
        (item) => item.options.map((option) => option.sessions).join(",") === "2,3,4,5,6",
      ),
    ).toBe(true);
  });
});
