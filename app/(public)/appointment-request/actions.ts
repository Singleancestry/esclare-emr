"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getBranch } from "@/lib/clinic/details";
import type { BranchCode } from "@/lib/clinic/details";
import { isFeatureEnabled } from "@/lib/features/flags";
import { treatments } from "@/lib/services/catalog";
import { appointmentRequestSchema } from "@/lib/validation/appointment-request";

export type PublicAppointmentRequestState = {
  status: "idle" | "saved" | "prepared" | "error";
  message: string | null;
  reference: string | null;
  preparedMessage: string | null;
  submittedBranchCode: BranchCode | null;
};

function createPublicReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `WEB-${date}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function submitPublicAppointmentRequest(
  _previousState: PublicAppointmentRequestState,
  formData: FormData,
): Promise<PublicAppointmentRequestState> {
  const parsed = appointmentRequestSchema.safeParse(Object.fromEntries(formData));
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");

  if (
    !parsed.success ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      idempotencyKey,
    )
  ) {
    return {
      status: "error",
      message: parsed.success
        ? "Refresh the form before submitting this request."
        : (parsed.error.issues[0]?.message ?? "Check your request details."),
      reference: null,
      preparedMessage: null,
      submittedBranchCode: null,
    };
  }

  const treatment = parsed.data.treatmentSlug
    ? treatments.find((item) => item.slug === parsed.data.treatmentSlug)
    : undefined;
  const branchDetails = getBranch(parsed.data.branchCode);
  const preparedMessage = `Hello ESCLARE ${branchDetails.name.replace("ESCLARE ", "")}. My name is ${parsed.data.fullName}. I would like to request ${treatment?.name ?? "an appointment"}${parsed.data.preferredDate ? ` on ${parsed.data.preferredDate}` : ""}${parsed.data.preferredTime ? ` at ${parsed.data.preferredTime}` : ""}. Please confirm availability.`;

  // Honeypot submissions receive a neutral response without reaching the database.
  if (parsed.data.website) {
    return {
      status: "prepared",
      message: "Continue through an official ESCLARE channel to confirm availability.",
      reference: null,
      preparedMessage,
      submittedBranchCode: parsed.data.branchCode,
    };
  }

  const admin = isFeatureEnabled("publicBookingPersistence") ? createSupabaseAdminClient() : null;
  const rateLimitSecret = process.env.APPOINTMENT_REQUEST_RATE_LIMIT_SECRET;

  if (!admin || !rateLimitSecret) {
    return {
      status: "prepared",
      message:
        "Your message is ready. Online saving is not configured yet, so continue through Facebook, phone, or SMS.",
      reference: null,
      preparedMessage,
      submittedBranchCode: parsed.data.branchCode,
    };
  }

  const branchCode = parsed.data.branchCode.toUpperCase();
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = forwardedFor || requestHeaders.get("x-real-ip") || "unavailable";
  const requestFingerprint = createHmac("sha256", rateLimitSecret)
    .update(clientAddress)
    .digest("hex");
  const { data: branch, error: branchError } = await admin
    .from("branches")
    .select("id")
    .eq("code", branchCode)
    .maybeSingle();

  if (branchError || !branch) {
    return {
      status: "error",
      message: "The selected branch is not ready for online requests. Please contact it directly.",
      reference: null,
      preparedMessage,
      submittedBranchCode: parsed.data.branchCode,
    };
  }

  let serviceId: string | null = null;

  if (treatment) {
    const { data: service } = await admin
      .from("services")
      .select("id")
      .eq("code", treatment.slug)
      .maybeSingle();
    serviceId = service?.id ?? null;
  }

  const reference = createPublicReference();
  const { data: savedReference, error } = await admin.rpc(
    "create_public_appointment_request_atomic",
    {
      p_idempotency_key: idempotencyKey,
      p_request_fingerprint: requestFingerprint,
      p_public_reference: reference,
      p_branch_id: branch.id,
      p_full_name: parsed.data.fullName,
      p_service_id: serviceId,
      p_requested_service: treatment?.name ?? null,
      p_preferred_date: parsed.data.preferredDate || null,
      p_preferred_time: parsed.data.preferredTime || null,
    },
  );

  if (error) {
    return {
      status: "error",
      message: "We could not save the request. Please use Facebook, phone, or SMS instead.",
      reference: null,
      preparedMessage,
      submittedBranchCode: parsed.data.branchCode,
    };
  }

  return {
    status: "saved",
    message:
      "Request saved for the ESCLARE team. Continue through an official channel to confirm your appointment.",
    reference: typeof savedReference === "string" ? savedReference : reference,
    preparedMessage,
    submittedBranchCode: parsed.data.branchCode,
  };
}
