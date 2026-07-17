import { describe, expect, it } from "vitest";
import {
  appointmentRequestSchema,
  appointmentRequestStatusUpdateSchema,
  canTransitionAppointmentRequest,
  getAppointmentRequestStatusOptions,
} from "@/lib/validation/appointment-request";

function futureDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

describe("public appointment request validation", () => {
  it("accepts a full-name-only request", () => {
    const result = appointmentRequestSchema.safeParse({
      fullName: "Sample Client",
      branchCode: "naga",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid treatments and past dates", () => {
    const result = appointmentRequestSchema.safeParse({
      fullName: "Sample Client",
      branchCode: "naga",
      treatmentSlug: "not-a-treatment",
      preferredDate: "2020-01-01",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "Choose a valid treatment.",
      );
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "Preferred date cannot be in the past.",
      );
    }
  });

  it("enforces the Daet Fractional Laser exception", () => {
    const result = appointmentRequestSchema.safeParse({
      fullName: "Sample Client",
      branchCode: "daet",
      treatmentSlug: "fractional-laser",
      preferredDate: futureDate(),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("is not available at the selected branch");
    }
  });
});

describe("appointment request status rules", () => {
  it("allows operational transitions and prevents reopening terminal requests", () => {
    expect(canTransitionAppointmentRequest("pending", "contacted")).toBe(true);
    expect(canTransitionAppointmentRequest("contacted", "confirmed")).toBe(true);
    expect(canTransitionAppointmentRequest("confirmed", "pending")).toBe(false);
    expect(getAppointmentRequestStatusOptions("archived")).toEqual([]);
  });

  it("requires a reason for every staff status change", () => {
    expect(
      appointmentRequestStatusUpdateSchema.safeParse({
        requestId: crypto.randomUUID(),
        status: "confirmed",
        reason: "ok",
      }).success,
    ).toBe(false);
  });
});
