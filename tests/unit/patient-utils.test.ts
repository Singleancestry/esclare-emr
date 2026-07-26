import { describe, expect, it } from "vitest";
import { calculateAge, calculateBmi, maskPhilippineMobile } from "@/lib/patients/utils";

describe("patient utilities", () => {
  it("calculates age from date of birth", () => {
    expect(calculateAge("2000-07-11", new Date("2026-07-10T00:00:00Z"))).toBe(25);
    expect(calculateAge("2000-07-10", new Date("2026-07-10T00:00:00Z"))).toBe(26);
  });

  it("does not calculate a negative age for invalid or future dates", () => {
    expect(calculateAge("2026-07-11", new Date("2026-07-10T00:00:00Z"))).toBeNull();
    expect(calculateAge("not-a-date", new Date("2026-07-10T00:00:00Z"))).toBeNull();
  });

  it("calculates BMI", () => {
    expect(calculateBmi(162, 55)).toBe(21);
  });

  it("masks Philippine mobile numbers", () => {
    expect(maskPhilippineMobile("09171234567")).toBe("0917 *** 4567");
    expect(maskPhilippineMobile("+639171234567")).toBe("0917 *** 4567");
  });
});
