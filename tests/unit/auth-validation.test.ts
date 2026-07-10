import { describe, expect, it } from "vitest";
import { loginSchema } from "@/lib/validation/auth";

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
