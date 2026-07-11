import type { AppointmentRequestStatus } from "@/lib/validation/appointment-request";

export type AppointmentRequestRecord = {
  id: string;
  reference: string;
  branchId: string;
  branchName: string;
  fullName: string;
  treatmentName: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  status: AppointmentRequestStatus;
  statusReason: string | null;
  submittedAt: string;
  handledAt: string | null;
};

export type AppointmentRequestInbox = {
  requests: AppointmentRequestRecord[];
  persistenceConfigured: boolean;
};
