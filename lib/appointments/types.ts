import type { AppointmentRequestStatus } from "@/lib/validation/appointment-request";
import type { AppointmentStatus } from "@/lib/validation/appointment";

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

export type AppointmentRecord = {
  id: string;
  branchId: string;
  patientName: string;
  serviceName: string;
  providerName: string | null;
  roomName: string | null;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  bookingNote: string | null;
};

export type AppointmentOption = { id: string; label: string; branchId?: string };

export type AppointmentWorkspace = {
  appointments: AppointmentRecord[];
  patients: AppointmentOption[];
  services: AppointmentOption[];
  providers: AppointmentOption[];
  rooms: AppointmentOption[];
  persistenceConfigured: boolean;
};
