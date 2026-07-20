import { CalendarClock, Inbox, ShieldCheck } from "lucide-react";
import { RequestStatusForm } from "@/components/appointments/request-status-form";
import { AppointmentScheduler } from "@/components/appointments/appointment-scheduler";
import { AppointmentStatusForm } from "@/components/appointments/appointment-status-form";
import { getAppointmentRequestInbox, getAppointmentWorkspace } from "@/lib/appointments/data";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requireFeature } from "@/lib/features/flags";
import { hasPermission, requirePermission } from "@/lib/permissions/checks";

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

export default async function AppointmentsPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "appointments.view");
  requireFeature("appointments", staff.employee.id);
  const [inbox, workspace] = await Promise.all([
    getAppointmentRequestInbox(staff),
    getAppointmentWorkspace(staff),
  ]);
  const canUpdate = hasPermission(staff, "appointments.confirm");
  const canCreate = hasPermission(staff, "appointments.create");
  const pendingCount = inbox.requests.filter((request) => request.status === "pending").length;

  return (
    <main className="grid gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6F263D]">Appointments</p>
          <h1 className="text-3xl font-semibold text-[#481827]">Schedule & Requests</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            Coordinate confirmed appointments and process website requests without mixing scheduling
            notes with clinical records.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Inbox size={18} className="text-[#6F263D]" /> {pendingCount} pending
        </div>
      </div>

      {!inbox.persistenceConfigured && (
        <div
          className="flex items-start gap-3 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
          role="status"
        >
          <ShieldCheck className="mt-0.5 shrink-0" size={18} />
          <p>
            Supabase is not configured in this local environment. Public messages can still be
            prepared, but no requests are saved to this inbox yet.
          </p>
        </div>
      )}

      {canCreate && (
        <AppointmentScheduler
          branches={staff.branches}
          patients={workspace.patients}
          services={workspace.services}
          providers={workspace.providers}
          rooms={workspace.rooms}
        />
      )}

      <section
        className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
        aria-label="Scheduled appointments"
      >
        <div className="border-b border-neutral-200 px-4 py-3">
          <h2 className="font-semibold text-[#481827]">Upcoming appointments</h2>
        </div>
        {workspace.appointments.length === 0 ? (
          <div className="grid min-h-40 place-items-center p-6 text-center text-sm text-neutral-600">
            No scheduled appointments for your branches.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Provider / room</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {workspace.appointments.map((appointment) => (
                  <tr key={appointment.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-neutral-700">
                      {formatSubmittedAt(appointment.startsAt)}
                      <p className="mt-1 text-xs text-neutral-500">
                        to{" "}
                        {new Intl.DateTimeFormat("en-PH", {
                          timeStyle: "short",
                          timeZone: "Asia/Manila",
                        }).format(new Date(appointment.endsAt))}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-neutral-900">
                      {appointment.patientName}
                    </td>
                    <td className="px-4 py-4 text-neutral-700">{appointment.serviceName}</td>
                    <td className="px-4 py-4 text-neutral-700">
                      {appointment.providerName ?? "Unassigned"}
                      <p className="mt-1 text-xs text-neutral-500">
                        {appointment.roomName ?? "No room"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#F3E9DD] px-2.5 py-1 text-xs font-semibold capitalize text-[#5B1830]">
                        {appointment.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <AppointmentStatusForm
                        appointmentId={appointment.id}
                        status={appointment.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
        aria-label="Appointment requests"
      >
        <div className="border-b border-neutral-200 px-4 py-3">
          <h2 className="font-semibold text-[#481827]">Public request inbox</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Requests remain unconfirmed until staff verifies availability.
          </p>
        </div>
        {inbox.requests.length === 0 ? (
          <div className="grid min-h-64 place-items-center p-8 text-center">
            <div>
              <CalendarClock className="mx-auto text-[#8D6C48]" size={28} />
              <h2 className="mt-3 text-lg font-semibold text-[#481827]">No appointment requests</h2>
              <p className="mt-1 text-sm text-neutral-600">
                New saved website requests will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Preference</th>
                  <th className="px-4 py-3">Status</th>
                  {canUpdate && <th className="px-4 py-3">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {inbox.requests.map((request) => (
                  <tr key={request.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-neutral-600">
                      {formatSubmittedAt(request.submittedAt)}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-[#6F263D]">
                      {request.reference}
                    </td>
                    <td className="px-4 py-4 font-semibold text-neutral-900">{request.fullName}</td>
                    <td className="px-4 py-4 text-neutral-700">{request.branchName}</td>
                    <td className="px-4 py-4 text-neutral-700">
                      <p>{request.treatmentName ?? "General appointment"}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {request.preferredDate ?? "Date open"}
                        {request.preferredTime ? ` at ${request.preferredTime.slice(0, 5)}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex border border-[#D7C9B8] bg-[#F8F3EC] px-2 py-1 text-xs font-semibold capitalize text-[#5B1830]">
                        {request.status}
                      </span>
                      {request.statusReason && (
                        <p className="mt-2 max-w-48 text-xs leading-5 text-neutral-500">
                          {request.statusReason}
                        </p>
                      )}
                    </td>
                    {canUpdate && (
                      <td className="px-4 py-4">
                        <RequestStatusForm requestId={request.id} currentStatus={request.status} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
