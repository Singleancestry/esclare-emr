"use client";

import { useActionState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import {
  createAppointmentAction,
  type AppointmentActionState,
} from "@/app/(staff)/appointments/actions";
import type { AppointmentOption } from "@/lib/appointments/types";
import type { BranchAccess } from "@/lib/permissions/types";

const initialState: AppointmentActionState = { status: "idle", message: null };

export function AppointmentScheduler({
  branches,
  patients,
  services,
  providers,
  rooms,
}: {
  branches: BranchAccess[];
  patients: AppointmentOption[];
  services: AppointmentOption[];
  providers: AppointmentOption[];
  rooms: AppointmentOption[];
}) {
  const [state, action, pending] = useActionState(createAppointmentAction, initialState);
  const inputClass =
    "min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#6F263D] focus:ring-2 focus:ring-[#6F263D]/10";
  return (
    <form
      action={action}
      className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:grid-cols-3"
    >
      <div className="lg:col-span-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#481827]">
          <Plus size={18} /> Schedule appointment
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Provider and room conflicts are blocked by the database.
        </p>
      </div>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700">
        Branch
        <select name="branchId" required className={inputClass}>
          {branches.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700">
        Patient
        <select name="patientId" required className={inputClass}>
          <option value="">Choose patient</option>
          {patients.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700">
        Service
        <select name="serviceId" className={inputClass}>
          <option value="">General appointment</option>
          {services.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700">
        Starts
        <input type="datetime-local" name="startsAt" required className={inputClass} />
      </label>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700">
        Ends
        <input type="datetime-local" name="endsAt" required className={inputClass} />
      </label>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700">
        Provider
        <select name="providerEmployeeId" className={inputClass}>
          <option value="">Unassigned</option>
          {providers.map((item) => (
            <option key={`${item.id}-${item.branchId}`} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700">
        Room
        <select name="roomId" className={inputClass}>
          <option value="">Unassigned</option>
          {rooms.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-neutral-700 lg:col-span-2">
        Booking note
        <input
          name="bookingNote"
          maxLength={500}
          className={inputClass}
          placeholder="Non-clinical scheduling note"
        />
      </label>
      <div className="flex items-end">
        <button
          disabled={pending}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#5B1830] px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending && <LoaderCircle className="animate-spin" size={16} />}Schedule
        </button>
      </div>
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`text-sm lg:col-span-3 ${state.status === "error" ? "text-red-700" : "text-emerald-700"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
