import type { PatientAuditRecord } from "@/lib/patients/types";

export function AuditLogTable({ events }: { events: PatientAuditRecord[] }) {
  return (
    <div className="overflow-hidden rounded border border-[#D9DDE3] bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-[#F8F4ED] text-xs uppercase text-[#6F263D]">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Entity</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Result</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t border-[#D9DDE3]">
              <td className="px-4 py-3">{new Date(event.createdAt).toLocaleString()}</td>
              <td className="px-4 py-3 font-semibold text-[#481827]">{event.action}</td>
              <td className="px-4 py-3">{event.entityType}</td>
              <td className="px-4 py-3">{event.actorRole ?? "system"}</td>
              <td className="px-4 py-3">{event.reason ?? "Not provided"}</td>
              <td className="px-4 py-3">{event.success ? "success" : "failure"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
