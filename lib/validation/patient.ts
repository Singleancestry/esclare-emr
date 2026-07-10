import { z } from "zod";
import { calculateBmi } from "@/lib/patients/utils";

export const philippineMobileSchema = z
  .string()
  .trim()
  .regex(/^(\+?63|0)9\d{9}$/, "Use a valid Philippine mobile number.");

export const patientRegistrationSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(1, "Last name is required."),
    preferredName: z.string().trim().optional(),
    dateOfBirth: z.string().date("Date of birth is required."),
    sexAtBirth: z.enum(["female", "male", "intersex", "prefer_not_to_say"]),
    gender: z.string().trim().optional(),
    civilStatus: z.string().trim().optional(),
    nationality: z.string().trim().min(1, "Nationality is required."),
    mobile: philippineMobileSchema,
    secondaryMobile: philippineMobileSchema.optional().or(z.literal("")),
    email: z.string().trim().email().optional().or(z.literal("")),
    preferredContactMethod: z.enum(["sms", "call", "email", "viber", "messenger"]),
    preferredLanguage: z.string().trim().min(1, "Preferred language is required."),
    country: z.string().trim().min(1, "Country is required."),
    region: z.string().trim().min(1, "Region is required."),
    province: z.string().trim().min(1, "Province is required."),
    cityMunicipality: z.string().trim().min(1, "City or municipality is required."),
    barangay: z.string().trim().min(1, "Barangay is required."),
    street: z.string().trim().optional(),
    building: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    emergencyName: z.string().trim().min(1, "Emergency contact name is required."),
    emergencyRelationship: z.string().trim().min(1, "Relationship is required."),
    emergencyMobile: philippineMobileSchema,
    emergencySecondaryContact: z.string().trim().optional(),
    heightCm: z.coerce.number().positive().max(260).optional().or(z.literal("")),
    weightKg: z.coerce.number().positive().max(400).optional().or(z.literal("")),
    referralSource: z.string().trim().optional(),
    referredBy: z.string().trim().optional(),
    campaign: z.string().trim().optional(),
    promoCode: z.string().trim().optional(),
    smsMarketingConsent: z.coerce.boolean().default(false),
    emailMarketingConsent: z.coerce.boolean().default(false),
    privacyAcknowledged: z.literal("on", {
      error: "Privacy-notice acknowledgement is required.",
    }),
    identityVerificationMethod: z.string().trim().min(1, "Identity verification method is required."),
    verifiedBy: z.string().trim().min(1, "Verifier is required."),
    branchId: z.string().uuid("Branch is required."),
  })
  .transform((value) => ({
    ...value,
    middleName: value.middleName || null,
    preferredName: value.preferredName || null,
    secondaryMobile: value.secondaryMobile || null,
    email: value.email || null,
    heightCm: value.heightCm === "" ? null : value.heightCm,
    weightKg: value.weightKg === "" ? null : value.weightKg,
    bmi: calculateBmi(value.heightCm === "" ? null : value.heightCm, value.weightKg === "" ? null : value.weightKg),
  }));

export const patientSearchSchema = z.object({
  query: z.string().trim().optional(),
  branchId: z.string().uuid().optional(),
  clinicalAlertLevel: z.string().trim().optional(),
  archived: z.enum(["active", "archived", "all"]).default("active"),
});

export type PatientRegistrationInput = z.input<typeof patientRegistrationSchema>;
export type PatientRegistrationData = z.output<typeof patientRegistrationSchema>;
