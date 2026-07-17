"use client";

import { useActionState } from "react";
import {
  transitionAppointmentAction,
  type AppointmentActionState,
} from "@/app/(staff)/appointments/actions";
import {
  getAppointmentTransitionOptions,
  type AppointmentStatus,
} from "@/lib/validation/appointment";

const initialState: AppointmentActionState = { status: "idle", message: null };

export function AppointmentStatusForm({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: AppointmentStatus;
}) {
  const [state, action, pending] = useActionState(transitionAppointmentAction, initialState);
  const options = getAppointmentTransitionOptions(status);
  if (!options.length) return <span className="text-xs text-neutral-500">Final status</span>;
  return (
    <form action={action} className="grid min-w-52 gap-2">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <select name="status" className="min-h-9 rounded-lg border border-neutral-300 px-2 text-sm">
        {options.map((item) => (
          <option key={item} value={item}>
            {item.replaceAll("_", " ")}
          </option>
        ))}
      </select>
      <input
        name="reason"
        maxLength={500}
        placeholder="Reason when required"
        className="min-h-9 rounded-lg border border-neutral-300 px-2 text-sm"
      />
      <button
        disabled={pending}
        className="min-h-9 rounded-lg bg-[#5B1830] px-3 text-xs font-semibold text-white disabled:opacity-60"
      >
        Update
      </button>
      {state.message && (
        <p className={`text-xs ${state.status === "error" ? "text-red-700" : "text-emerald-700"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
