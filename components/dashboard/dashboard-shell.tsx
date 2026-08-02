import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { getAuthorizedNavigation } from "@/lib/permissions/navigation";
import type { StaffContext } from "@/lib/permissions/types";

type DashboardShellProps = {
  staff: StaffContext;
};

export function DashboardShell({ staff }: DashboardShellProps) {
  const workspaces = getAuthorizedNavigation(staff).filter((item) => item.href !== "/dashboard");

  return (
    <main className="p-4 sm:p-6">
      <div className="border-b border-[#D9DDE3] pb-5">
        <p className="text-sm font-semibold uppercase text-[#6F263D]">{staff.activeBranch.name}</p>
        <h1 className="mt-1 text-3xl font-semibold text-[#481827]">Clinic dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5F6368]">
          Open a workspace to manage today&apos;s clinic operations. Access is limited by your role,
          assigned branch, feature release status, and database security policies.
        </p>
      </div>

      <section className="mt-6" aria-labelledby="workspace-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-[#7A7F86]">Authorized access</p>
            <h2 id="workspace-heading" className="mt-1 text-xl font-semibold text-[#481827]">
              Your workspaces
            </h2>
          </div>
          <p className="text-sm text-[#5F6368]">{workspaces.length} available</p>
        </div>

        <div className="mt-3 divide-y divide-[#E6E8EB] border-y border-[#D9DDE3] bg-white">
          {workspaces.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className="focus-ring flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-[#F8F4ED]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#F8F4ED] text-[#6F263D]">
                  <Icon size={18} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase text-[#7A7F86]">
                    {item.section}
                  </span>
                  <span className="block truncate text-sm font-semibold text-[#262626]">
                    {item.label}
                  </span>
                </span>
                <ArrowRight size={17} className="shrink-0 text-[#6F263D]" aria-hidden />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Session context">
        <div className="border-l-2 border-[#6F263D] bg-white px-4 py-4">
          <div className="flex items-center gap-2 text-[#481827]">
            <Building2 size={18} aria-hidden />
            <h2 className="font-semibold">Active branch</h2>
          </div>
          <p className="mt-2 text-sm text-[#5F6368]">
            {staff.activeBranch.name} ({staff.activeBranch.code})
          </p>
        </div>
        <div className="border-l-2 border-[#C69B52] bg-white px-4 py-4">
          <div className="flex items-center gap-2 text-[#481827]">
            <ShieldCheck size={18} aria-hidden />
            <h2 className="font-semibold">Signed-in role</h2>
          </div>
          <p className="mt-2 text-sm text-[#5F6368]">
            {staff.employee.displayName} · {staff.activeRole.name}
          </p>
        </div>
      </section>
    </main>
  );
}
