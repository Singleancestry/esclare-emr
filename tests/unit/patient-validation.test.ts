import { describe, expect, it } from "vitest";
import { patientRegistrationSchema, philippineMobileSchema } from "@/lib/validation/patient";

const validRegistration = {
  firstName: "Test",
  middleName: "",
  lastName: "Patient",
  preferredName: "",
  dateOfBirth: "1995-01-15",
  sexAtBirth: "female",
  gender: "",
  civilStatus: "",
  nationality: "Filipino",
  mobile: "09171234567",
  secondaryMobile: "",
  email: "",
  preferredContactMethod: "sms",
  preferredLanguage: "English",
  country: "Philippines",
  region: "Bicol Region",
  province: "Camarines Sur",
  cityMunicipality: "Naga City",
  barangay: "Demo",
  street: "",
  building: "",
  postalCode: "",
  emergencyName: "Emergency Contact",
  emergencyRelationship: "Sibling",
  emergencyMobile: "09181234567",
  emergencySecondaryContact: "",
  heightCm: "160",
  weightKg: "55",
  referralSource: "",
  referredBy: "",
  campaign: "",
  promoCode: "",
  smsMarketingConsent: "false",
  emailMarketingConsent: "false",
  privacyAcknowledged: "on",
  identityVerificationMethod: "Government ID",
  verifiedBy: "Demo Owner",
  branchId: "00000000-0000-4000-8000-000000000101",
};

describe("philippineMobileSchema", () => {
  it("accepts local and +63 mobile formats", () => {
    expect(philippineMobileSchema.safeParse("09171234567").success).toBe(true);
    expect(philippineMobileSchema.safeParse("+639171234567").success).toBe(true);
  });

  it("rejects invalid mobile numbers", () => {
    expect(philippineMobileSchema.safeParse("021234567").success).toBe(false);
  });
});

describe("patientRegistrationSchema", () => {
  it("validates complete registration input and calculates BMI", () => {
    const result = patientRegistrationSchema.safeParse(validRegistration);

    expect(result.success).toBe(true);
    expect(result.success ? result.data.bmi : null).toBe(21.5);
  });

  it("requires privacy acknowledgement", () => {
    const result = patientRegistrationSchema.safeParse({
      ...validRegistration,
      privacyAcknowledged: undefined,
    });

    expect(result.success).toBe(false);
  });
});
