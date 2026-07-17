import { z } from "zod";
import { isTreatmentAvailable, type BranchCode } from "@/lib/clinic/details";
import { treatments } from "@/lib/services/catalog";

export const appointmentRequestStatuses = [
  "pending",
  "contacted",
  "confirmed",
  "declined",
  "cancelled",
  "archived",
] as const;

export type AppointmentRequestStatus = (typeof appointmentRequestStatuses)[number];

const optionalDate = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Choose a valid preferred date.",
  );

const optionalTime = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value),
    "Choose a valid preferred time.",
  );

export const appointmentRequestSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(120, "Full name is too long."),
    branchCode: z.enum(["naga", "daet"]),
    treatmentSlug: z.string().trim().max(100).optional().default(""),
    preferredDate: optionalDate.optional().default(""),
    preferredTime: optionalTime.optional().default(""),
    website: z.string().trim().max(200).optional().default(""),
  })
  .superRefine((value, context) => {
    const treatment = value.treatmentSlug
      ? treatments.find((item) => item.slug === value.treatmentSlug)
      : undefined;

    if (value.treatmentSlug && !treatment) {
      context.addIssue({
        code: "custom",
        path: ["treatmentSlug"],
        message: "Choose a valid treatment.",
      });
    }

    if (treatment && !isTreatmentAvailable(value.branchCode as BranchCode, treatment.name)) {
      context.addIssue({
        code: "custom",
        path: ["treatmentSlug"],
        message: `${treatment.name} is not available at the selected branch.`,
      });
    }

    if (value.preferredDate) {
      const today = new Date();
      const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");
      if (value.preferredDate < localToday) {
        context.addIssue({
          code: "custom",
          path: ["preferredDate"],
          message: "Preferred date cannot be in the past.",
        });
      }
    }
  });

export const appointmentRequestStatusUpdateSchema = z.object({
  requestId: z.string().uuid("Invalid appointment request."),
  status: z.enum(appointmentRequestStatuses),
  reason: z
    .string()
    .trim()
    .min(3, "Add a short reason for this status change.")
    .max(300, "Reason is too long."),
});

const allowedStatusTransitions: Record<
  AppointmentRequestStatus,
  ReadonlyArray<AppointmentRequestStatus>
> = {
  pending: ["contacted", "confirmed", "declined", "cancelled", "archived"],
  contacted: ["confirmed", "declined", "cancelled", "archived"],
  confirmed: ["cancelled", "archived"],
  declined: ["archived"],
  cancelled: ["archived"],
  archived: [],
};

export function canTransitionAppointmentRequest(
  currentStatus: AppointmentRequestStatus,
  nextStatus: AppointmentRequestStatus,
) {
  return allowedStatusTransitions[currentStatus].includes(nextStatus);
}

export function getAppointmentRequestStatusOptions(currentStatus: AppointmentRequestStatus) {
  return allowedStatusTransitions[currentStatus];
}

export type AppointmentRequestInput = z.output<typeof appointmentRequestSchema>;
