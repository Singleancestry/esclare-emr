import { describe, expect, it } from "vitest";
import { loginSchema, passwordRecoverySchema, passwordUpdateSchema } from "@/lib/validation/auth";

describe("loginSchema", () => {
  it("accepts strong staff credentials", () => {
    const result = loginSchema.safeParse({
      email: "owner.demo@esclare.local",
      password: "StrongPass123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects weak passwords", () => {
    const result = loginSchema.safeParse({
      email: "owner.demo@esclare.local",
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid email addresses", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "StrongPass123",
    });

    expect(result.success).toBe(false);
  });
});

describe("password recovery validation", () => {
  it("accepts a valid recovery email", () => {
    expect(passwordRecoverySchema.safeParse({ email: "staff@esclare.ph" }).success).toBe(true);
  });

  it("requires matching strong replacement passwords", () => {
    expect(
      passwordUpdateSchema.safeParse({
        password: "Replacement123",
        confirmPassword: "Replacement123",
      }).success,
    ).toBe(true);
    expect(
      passwordUpdateSchema.safeParse({
        password: "Replacement123",
        confirmPassword: "Different123",
      }).success,
    ).toBe(false);
  });
});
