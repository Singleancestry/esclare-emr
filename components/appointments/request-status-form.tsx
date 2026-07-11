"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import {
  updateAppointmentRequestStatusAction,
  type AppointmentRequestUpdateState,
} from "@/app/(staff)/appointments/actions";
import {
  getAppointmentRequestStatusOptions,
  type AppointmentRequestStatus,
} from "@/lib/validation/appointment-request";

const initialState: AppointmentRequestUpdateState = { status: "idle", message: null };

export function RequestStatusForm({ requestId, currentStatus }: { requestId: string; currentStatus: AppointmentRequestStatus }) {
  const [state, formAction, isPending] = useActionState(updateAppointmentRequestStatusAction, initialState);
  const options = getAppointmentRequestStatusOptions(currentStatus);

  if (options.length === 0) {
    return <span className="text-xs text-neutral-500">No further action</span>;
  }

  return (
    <form action={formAction} className="grid min-w-60 gap-2">
      <input type="hidden" name="requestId" value={requestId} />
      <label className="sr-only" htmlFor={`status-${requestId}`}>New status</label>
      <select id={`status-${requestId}`} name="status" className="min-h-9 border border-neutral-300 bg-white px-2 text-sm text-neutral-800">
        {options.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
      </select>
      <label className="sr-only" htmlFor={`reason-${requestId}`}>Status reason</label>
      <input id={`reason-${requestId}`} name="reason" required minLength={3} maxLength={300} placeholder="Reason or contact note" className="min-h-9 border border-neutral-300 px-2 text-sm outline-none focus:border-[#6F263D]" />
      <button type="submit" disabled={isPending} className="inline-flex min-h-9 items-center justify-center gap-2 bg-[#5B1830] px-3 text-xs font-semibold text-white disabled:opacity-60">
        {isPending && <LoaderCircle className="animate-spin" size={14} />}
        Update status
      </button>
      {state.message && <p role={state.status === "error" ? "alert" : "status"} className={`text-xs ${state.status === "error" ? "text-red-700" : "text-emerald-700"}`}>{state.message}</p>}
    </form>
  );
}
