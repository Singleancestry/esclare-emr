import { z } from "zod";

export const appointmentStatuses = [
  "scheduled",
  "confirmed",
  "checked_in",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

const optionalUuid = z
  .union([z.literal(""), z.string().uuid()])
  .transform((value) => value || null);

export const appointmentCreateSchema = z
  .object({
    branchId: z.string().uuid("Choose a branch."),
    patientId: z.string().uuid("Choose a patient."),
    serviceId: optionalUuid,
    providerEmployeeId: optionalUuid,
    roomId: optionalUuid,
    startsAt: z.string().datetime({ local: true }),
    endsAt: z.string().datetime({ local: true }),
    bookingNote: z.string().trim().max(500, "Booking note is too long.").optional().default(""),
  })
  .superRefine((value, context) => {
    const start = new Date(value.startsAt);
    const end = new Date(value.endsAt);
    if (end <= start) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End time must be after the start time.",
      });
    }
    if (end.getTime() - start.getTime() > 8 * 60 * 60 * 1000) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "An appointment cannot exceed 8 hours.",
      });
    }
  });

const allowedTransitions: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  scheduled: ["confirmed", "checked_in", "cancelled", "no_show"],
  confirmed: ["checked_in", "cancelled", "no_show"],
  checked_in: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  no_show: [],
};

export const appointmentTransitionSchema = z
  .object({
    appointmentId: z.string().uuid("Invalid appointment."),
    status: z.enum(appointmentStatuses),
    reason: z.string().trim().max(500, "Reason is too long.").optional().default(""),
  })
  .superRefine((value, context) => {
    if (["cancelled", "no_show"].includes(value.status) && value.reason.length < 3) {
      context.addIssue({
        code: "custom",
        path: ["reason"],
        message: "Add a reason for cancellation or no-show.",
      });
    }
  });

export function canTransitionAppointment(current: AppointmentStatus, next: AppointmentStatus) {
  return allowedTransitions[current].includes(next);
}

export function getAppointmentTransitionOptions(current: AppointmentStatus) {
  return allowedTransitions[current];
}
