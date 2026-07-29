import { z } from "zod";

const refundInputSchema = z.object({
  amountPaid: z.number().finite().nonnegative(),
  regularPricePerSession: z.number().finite().nonnegative(),
  sessionsPurchased: z.number().int().positive(),
  sessionsUsed: z.number().int().nonnegative(),
  promotionalBenefitValue: z.number().finite().nonnegative().default(0),
  lawfulDisclosedDeductions: z.number().finite().nonnegative().default(0),
});

export type PackageRefundInput = z.input<typeof refundInputSchema>;

function toCentavos(value: number) {
  return Math.round(value * 100);
}

function toPesos(value: number) {
  return value / 100;
}

export function calculatePreliminaryPackageRefund(input: PackageRefundInput) {
  const parsed = refundInputSchema.parse(input);
  if (parsed.sessionsUsed > parsed.sessionsPurchased) {
    throw new Error("Sessions used cannot exceed sessions purchased.");
  }

  const amountPaid = toCentavos(parsed.amountPaid);
  const regularPrice = toCentavos(parsed.regularPricePerSession);
  const usedSessionValue = regularPrice * parsed.sessionsUsed;
  const promotionalBenefits = toCentavos(parsed.promotionalBenefitValue);
  const deductions = toCentavos(parsed.lawfulDisclosedDeductions);
  const unclamped = amountPaid - usedSessionValue - promotionalBenefits - deductions;
  const preliminaryRefund = Math.max(0, Math.min(amountPaid, unclamped));

  return {
    amountPaid: toPesos(amountPaid),
    regularPricePerSession: toPesos(regularPrice),
    sessionsPurchased: parsed.sessionsPurchased,
    sessionsUsed: parsed.sessionsUsed,
    usedSessionValue: toPesos(usedSessionValue),
    promotionalBenefitValue: toPesos(promotionalBenefits),
    lawfulDisclosedDeductions: toPesos(deductions),
    preliminaryRefund: toPesos(preliminaryRefund),
    requiresManagementApproval: true as const,
  };
}
