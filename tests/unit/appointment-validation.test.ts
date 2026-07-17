import { describe, expect, it } from "vitest";
import {
  appointmentCreateSchema,
  appointmentTransitionSchema,
  canTransitionAppointment,
} from "@/lib/validation/appointment";

const validAppointment = {
  branchId: "00000000-0000-4000-8000-000000000101",
  patientId: "00000000-0000-4000-8000-000000000201",
  serviceId: "",
  providerEmployeeId: "",
  roomId: "",
  startsAt: "2026-07-13T10:00:00",
  endsAt: "2026-07-13T11:00:00",
  bookingNote: "Initial assessment",
};

describe("appointment validation", () => {
  it("accepts a valid branch-aware appointment", () => {
    expect(appointmentCreateSchema.safeParse(validAppointment).success).toBe(true);
  });

  it("rejects inverted and excessive time ranges", () => {
    expect(
      appointmentCreateSchema.safeParse({ ...validAppointment, endsAt: "2026-07-13T09:00:00" })
        .success,
    ).toBe(false);
    expect(
      appointmentCreateSchema.safeParse({ ...validAppointment, endsAt: "2026-07-13T19:00:01" })
        .success,
    ).toBe(false);
  });

  it("allows only operational status transitions", () => {
    expect(canTransitionAppointment("scheduled", "checked_in")).toBe(true);
    expect(canTransitionAppointment("checked_in", "completed")).toBe(false);
    expect(canTransitionAppointment("completed", "cancelled")).toBe(false);
  });

  it("requires a reason for cancellation and no-show", () => {
    const base = { appointmentId: "00000000-0000-4000-8000-000000000301", reason: "" };
    expect(appointmentTransitionSchema.safeParse({ ...base, status: "cancelled" }).success).toBe(
      false,
    );
    expect(
      appointmentTransitionSchema.safeParse({
        ...base,
        status: "no_show",
        reason: "Client did not arrive",
      }).success,
    ).toBe(true);
  });
});
