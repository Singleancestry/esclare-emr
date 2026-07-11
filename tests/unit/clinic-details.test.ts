import { describe, expect, it } from "vitest";
import { bookingRules, getBranch, isTreatmentAvailable } from "@/lib/clinic/details";

describe("clinic details", () => {
  it("keeps full name as the only required personal booking information", () => {
    expect(bookingRules.requiredPersonalInformation).toEqual(["fullName"]);
    expect(bookingRules.depositRequired).toBe(false);
    expect(bookingRules.changeNoticeHours).toBe(2);
  });

  it("applies the confirmed Daet treatment exception", () => {
    expect(isTreatmentAvailable("naga", "Fractional Laser and Scar Care")).toBe(true);
    expect(isTreatmentAvailable("daet", "Fractional Laser and Scar Care")).toBe(false);
    expect(getBranch("daet").schedule).toContain("Tuesday-Sunday");
  });
});
