import { describe, expect, it } from "vitest";
import { diodePackages, formatTreatmentPrice, treatments } from "@/lib/services/catalog";

describe("service catalog", () => {
  it("formats fixed, ranged and starting prices without inventing promotions", () => {
    expect(formatTreatmentPrice(treatments.find((item) => item.slug === "korean-facial")!)).toBe("₱1,800 / session");
    expect(formatTreatmentPrice(treatments.find((item) => item.slug === "acne-cleanse")!)).toBe("₱499-₱599 / session");
    expect(formatTreatmentPrice(treatments.find((item) => item.slug === "laser-circumcision")!)).toBe("Starts at ₱3,999");
  });

  it("keeps all diode packages complete from two through six sessions", () => {
    expect(diodePackages).toHaveLength(13);
    expect(diodePackages.every((item) => item.options.map((option) => option.sessions).join(",") === "2,3,4,5,6")).toBe(true);
  });
});
