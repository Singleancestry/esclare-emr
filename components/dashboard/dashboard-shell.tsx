import { Activity, AlertTriangle, CalendarCheck, CircleDollarSign, UserRoundCheck } from "lucide-react";
import type { StaffContext } from "@/lib/permissions/types";
import { DashboardCard } from "./dashboard-card";

type DashboardShellProps = {
  staff: StaffContext;
};

const ownerCards = [
  ["Today's total sales", "PHP 128,450", "Across Naga and Daet demo branches", "success"],
  ["Appointments today", "34", "9 pending confirmation", "info"],
  ["Outstanding balances", "PHP 42,100", "Requires cashier follow-up", "warning"],
  ["Security alerts", "2", "Review trusted-device changes", "danger"],
] as const;

const receptionCards = [
  ["Today's appointments", "22", "Naga branch schedule", "info"],
  ["Pending requests", "7", "Public requests awaiting review", "warning"],
  ["Checked in", "5", "Ready for provider handoff", "success"],
] as const;

const cashierCards = [
  ["Current POS session", "Open", "Cashier drawer started at 09:00", "success"],
  ["Payments today", "PHP 58,200", "Cash, GCash, card and Maya", "info"],
  ["Refund requests", "1", "Approval required", "warning"],
] as const;

const providerCards = [
  ["Assigned patients", "14", "Includes follow-up cases", "info"],
  ["Open encounters", "3", "Require completion before signing", "warning"],
  ["Unsigned records", "2", "Provider signature pending", "danger"],
] as const;

const doctorCards = [
  ["Awaiting assessment", "4", "Doctor-required treatments", "warning"],
  ["Records for signature", "3", "Clinical sign-off queue", "danger"],
  ["Medical alerts", "5", "Review before treatment", "info"],
] as const;

function cardsForRole(role: StaffContext["activeRole"]["key"]) {
  if (role === "owner" || role === "super_admin" || role === "branch_manager") {
    return ownerCards;
  }

  if (role === "receptionist") {
    return receptionCards;
  }

  if (role === "cashier") {
    return cashierCards;
  }

  if (role === "doctor") {
    return doctorCards;
  }

  return providerCards;
}

export function DashboardShell({ staff }: DashboardShellProps) {
  const cards = cardsForRole(staff.activeRole.key);

  return (
    <main className="p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6F263D]">{staff.activeBranch.name}</p>
          <h1 className="text-3xl font-semibold text-[#481827]">Dashboard</h1>
        </div>
        <div className="rounded border border-[#D9DDE3] bg-white px-4 py-3 text-sm text-[#5F6368]">
          Signed in as <span className="font-semibold text-[#262626]">{staff.employee.displayName}</span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard metrics">
        {cards.map(([label, value, detail, tone]) => (
          <DashboardCard key={label} label={label} value={value} detail={detail} tone={tone} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="text-[#6F263D]" size={20} aria-hidden />
            <h2 className="text-xl font-semibold text-[#481827]">Branch activity</h2>
          </div>
          <div className="grid h-64 place-items-center rounded border border-dashed border-[#D9DDE3] bg-[#F8F4ED] text-sm font-semibold text-[#6F263D]">
            Recharts reporting surface reserved for finance and reports phases
          </div>
        </article>
        <article className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="text-[#C38221]" size={20} aria-hidden />
            <h2 className="text-xl font-semibold text-[#481827]">Operational queue</h2>
          </div>
          <div className="grid gap-3">
            <QueueItem icon={CalendarCheck} label="Appointments needing confirmation" value="9" />
            <QueueItem icon={UserRoundCheck} label="Employee access reviews" value="3" />
            <QueueItem icon={CircleDollarSign} label="Payment approvals" value="2" />
          </div>
        </article>
      </section>
    </main>
  );
}

function QueueItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded border border-[#D9DDE3] px-3 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-[#343434]">
        <Icon size={17} className="text-[#6F263D]" aria-hidden />
        {label}
      </span>
      <span className="rounded bg-[#F8F4ED] px-2 py-1 text-sm font-bold text-[#481827]">{value}</span>
    </div>
  );
}
