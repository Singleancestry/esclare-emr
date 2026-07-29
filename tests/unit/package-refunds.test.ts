import { describe, expect, it } from "vitest";
import { calculatePreliminaryPackageRefund } from "@/lib/packages/refunds";

describe("package refund calculation", () => {
  it("uses the regular session price and always requires management approval", () => {
    expect(
      calculatePreliminaryPackageRefund({
        amountPaid: 6000,
        regularPricePerSession: 1000,
        sessionsPurchased: 12,
        sessionsUsed: 3,
      }),
    ).toMatchObject({
      usedSessionValue: 3000,
      preliminaryRefund: 3000,
      requiresManagementApproval: true,
    });
  });

  it("deducts promotional benefits and lawful disclosed charges", () => {
    expect(
      calculatePreliminaryPackageRefund({
        amountPaid: 6000,
        regularPricePerSession: 1000,
        sessionsPurchased: 12,
        sessionsUsed: 2,
        promotionalBenefitValue: 500,
        lawfulDisclosedDeductions: 250,
      }).preliminaryRefund,
    ).toBe(3250);
  });

  it("clamps the result between zero and the amount paid", () => {
    expect(
      calculatePreliminaryPackageRefund({
        amountPaid: 1000,
        regularPricePerSession: 900,
        sessionsPurchased: 2,
        sessionsUsed: 2,
      }).preliminaryRefund,
    ).toBe(0);
  });

  it("rejects impossible session counts", () => {
    expect(() =>
      calculatePreliminaryPackageRefund({
        amountPaid: 6000,
        regularPricePerSession: 1000,
        sessionsPurchased: 3,
        sessionsUsed: 4,
      }),
    ).toThrow("Sessions used cannot exceed sessions purchased.");
  });
});
