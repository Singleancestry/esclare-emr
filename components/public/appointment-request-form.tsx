"use client";

import { useActionState, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Copy, ExternalLink, LoaderCircle, MessageCircle, Phone } from "lucide-react";
import {
  submitPublicAppointmentRequest,
  type PublicAppointmentRequestState,
} from "@/app/(public)/appointment-request/actions";
import { clinicBranches, getBranch, type BranchCode } from "@/lib/clinic/details";
import { treatments } from "@/lib/services/catalog";

const initialPublicAppointmentRequestState: PublicAppointmentRequestState = {
  status: "idle",
  message: null,
  reference: null,
  preparedMessage: null,
  submittedBranchCode: null,
};

export function AppointmentRequestForm({ initialBranch = "naga" }: { initialBranch?: BranchCode }) {
  const [fullName, setFullName] = useState("");
  const [branchCode, setBranchCode] = useState<BranchCode>(initialBranch);
  const [treatmentSlug, setTreatmentSlug] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [state, formAction, isPending] = useActionState(
    submitPublicAppointmentRequest,
    initialPublicAppointmentRequestState,
  );
  const selectedBranch = getBranch(branchCode);
  const confirmationBranch = state.submittedBranchCode ? getBranch(state.submittedBranchCode) : selectedBranch;
  const availableTreatments = treatments.filter((item) => !selectedBranch.unavailableTreatments.includes(item.name));
  const prepared = state.status === "saved" || state.status === "prepared";
  const error = state.status === "error" ? state.message : null;
  const message = state.preparedMessage ?? "";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <div className="grid gap-0 overflow-hidden border border-[#D8C9B4] bg-white shadow-[0_24px_70px_rgba(55,28,37,0.1)] lg:grid-cols-[1fr_0.72fr]">
      <form action={formAction} noValidate className="p-5 sm:p-9 lg:p-11">
        <div className="mb-8"><p className="public-eyebrow">Step 1</p><h2 className="mt-3 text-3xl text-[#481827]">Plan your request</h2><p className="mt-2 text-sm leading-6 text-[#6B6264]">Only your full name is required. Add visit preferences when you are ready.</p></div>
        <div className="grid gap-5">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.05em] text-[#3F1724]">Full name <span className="font-normal normal-case tracking-normal text-[#77716A]">Required</span><input name="fullName" aria-invalid={Boolean(error)} aria-describedby={error ? "booking-error" : undefined} value={fullName} onChange={(event) => setFullName(event.target.value)} className="min-h-12 rounded-sm border border-[#CFC7BE] px-3 py-3 font-normal normal-case tracking-normal text-[#292524] outline-none transition-colors focus:border-[#6F263D] focus:ring-2 focus:ring-[#6F263D]/10" autoComplete="name" placeholder="Your full name" /></label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.05em] text-[#3F1724]">Branch<select name="branchCode" value={branchCode} onChange={(event) => { setBranchCode(event.target.value as BranchCode); setTreatmentSlug(""); }} className="min-h-12 rounded-sm border border-[#CFC7BE] bg-white px-3 py-3 font-normal normal-case tracking-normal text-[#292524] outline-none focus:border-[#6F263D]">{clinicBranches.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.05em] text-[#3F1724]">Treatment <span className="font-normal normal-case tracking-normal text-[#77716A]">Optional</span><select name="treatmentSlug" value={treatmentSlug} onChange={(event) => setTreatmentSlug(event.target.value)} className="min-h-12 rounded-sm border border-[#CFC7BE] bg-white px-3 py-3 font-normal normal-case tracking-normal text-[#292524] outline-none focus:border-[#6F263D]"><option value="">General appointment</option>{availableTreatments.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.05em] text-[#3F1724]">Preferred date <span className="font-normal normal-case tracking-normal text-[#77716A]">Optional</span><span className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-3.5 text-[#7A655D]" size={17} /><input name="preferredDate" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="min-h-12 w-full rounded-sm border border-[#CFC7BE] py-3 pl-10 pr-3 font-normal normal-case tracking-normal text-[#292524] outline-none focus:border-[#6F263D]" /></span></label>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.05em] text-[#3F1724]">Preferred time <span className="font-normal normal-case tracking-normal text-[#77716A]">Optional</span><span className="relative"><Clock className="pointer-events-none absolute left-3 top-3.5 text-[#7A655D]" size={17} /><input name="preferredTime" type="time" value={time} onChange={(event) => setTime(event.target.value)} className="min-h-12 w-full rounded-sm border border-[#CFC7BE] py-3 pl-10 pr-3 font-normal normal-case tracking-normal text-[#292524] outline-none focus:border-[#6F263D]" /></span></label>
          </div>
          <label className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          {error && <p id="booking-error" role="alert" className="border-l-2 border-[#B42D43] bg-[#FFF2F3] px-3 py-2 text-sm text-[#8B1F32]">{error}</p>}
          <p className="text-xs leading-5 text-[#6E6862]">Preparing this form does not confirm a slot. ESCLARE confirms through Facebook, phone call, or SMS.</p>
          <button type="submit" disabled={isPending} className="luxury-button w-full disabled:cursor-wait disabled:opacity-70 sm:w-fit">{isPending ? <><LoaderCircle className="animate-spin" size={17} /> Sending request</> : "Prepare request"}</button>
        </div>
      </form>

      <aside className="bg-[#EEE6DA] p-5 sm:p-9 lg:p-11">
        <p className="public-eyebrow">Step 2</p><h2 className="mt-3 text-3xl text-[#481827]">Confirm with {confirmationBranch.name}</h2>
        <p className="mt-3 text-sm leading-6 text-[#625D58]">{confirmationBranch.schedule}.{confirmationBranch.lastClient ? ` ${confirmationBranch.lastClient}` : ""}</p>
        {prepared ? <div className="mt-6 border border-[#D3C2AC] bg-white p-4" role="status" aria-live="polite"><p className="flex items-center gap-2 text-sm font-semibold text-[#316847]"><CheckCircle2 size={17} /> {state.status === "saved" ? "Request saved" : "Request ready"}</p>{state.reference && <p className="mt-2 text-xs font-bold uppercase text-[#6F263D]">Reference {state.reference}</p>}<p className="mt-3 text-sm leading-6 text-[#4E4945]">{message}</p>{state.message && <p className="mt-3 text-xs leading-5 text-[#6E6862]">{state.message}</p>}<button type="button" onClick={copyMessage} className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase text-[#5B1830]"><Copy size={14} /> {copied ? "Copied" : "Copy message"}</button></div> : <p className="mt-6 text-sm leading-6 text-[#625D58]">Enter your full name to prepare the message you can send through an official channel.</p>}
        {copyError && <p role="alert" className="mt-3 text-xs text-[#8B1F32]">The message could not be copied. You can still open Messenger, call, or send an SMS.</p>}
        <div className="mt-6 grid gap-3">
          <a href={confirmationBranch.messenger} target="_blank" rel="noreferrer" className="luxury-button justify-between"><span className="inline-flex items-center gap-2"><MessageCircle size={17} /> Facebook Messenger</span><ExternalLink size={15} /></a>
          <a href={`tel:${confirmationBranch.phoneHref}`} className="luxury-button-outline justify-start bg-white"><Phone size={17} /> Call {confirmationBranch.phone}</a>
          <a href={`sms:${confirmationBranch.phoneHref}${prepared ? `?body=${encodeURIComponent(`${message}${state.reference ? ` Reference: ${state.reference}.` : ""}`)}` : ""}`} className="luxury-button-outline justify-start bg-white"><MessageCircle size={17} /> Send SMS</a>
        </div>
        <p className="mt-6 text-xs leading-5 text-[#6E6862]">No deposit is required. Please give at least 2 hours notice when cancelling or rescheduling.</p>
      </aside>
    </div>
  );
}
