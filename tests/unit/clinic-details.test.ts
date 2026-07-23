import { describe, expect, it } from "vitest";
import { bookingRules, getBranch, isBranchOpen, isTreatmentAvailable } from "@/lib/clinic/details";

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

  it("uses only the confirmed official branch social links", () => {
    expect(getBranch("naga").facebook).toBe("https://www.facebook.com/EsclareLaserCenter/");
    expect(getBranch("naga").messenger).toBe("https://m.me/625552207599338");
    expect(getBranch("daet").facebook).toBe("https://www.facebook.com/esclaredaet/");
    expect(getBranch("daet").messenger).toBe("https://m.me/110985556908419");
  });

  it("calculates branch opening status in the clinic timezone", () => {
    expect(isBranchOpen(getBranch("daet"), new Date("2026-07-20T03:00:00Z"))).toBe(false);
    expect(isBranchOpen(getBranch("daet"), new Date("2026-07-21T03:00:00Z"))).toBe(true);
    expect(isBranchOpen(getBranch("daet"), new Date("2026-07-21T11:00:00Z"))).toBe(false);
  });
});
