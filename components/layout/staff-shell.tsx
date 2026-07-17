import Link from "next/link";
import type { Route } from "next";
import { Bell, LockKeyhole, Search } from "lucide-react";
import { getAuthorizedNavigation } from "@/lib/permissions/navigation";
import type { StaffContext } from "@/lib/permissions/types";

type StaffShellProps = {
  staff: StaffContext;
  children: React.ReactNode;
};

export function StaffShell({ staff, children }: StaffShellProps) {
  const navigation = getAuthorizedNavigation(staff);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#262626] lg:grid lg:grid-cols-[288px_1fr]">
      <aside className="border-r border-[#D9DDE3] bg-white">
        <div className="flex h-16 items-center border-b border-[#D9DDE3] px-5">
          <Link href="/dashboard" className="font-serif text-2xl font-semibold text-[#6F263D]">
            ESCLARE
          </Link>
        </div>
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4" aria-label="Main">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.href} className="mb-1">
                <Link
                  href={item.href as Route}
                  className="focus-ring flex items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold text-[#343434] hover:bg-[#F8F4ED]"
                >
                  <Icon size={18} aria-hidden />
                  <span>{item.label}</span>
                </Link>
                {item.children?.length ? (
                  <div className="ml-9 mt-1 grid gap-1 border-l border-[#E4D8BF] pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href as Route}
                        className="focus-ring rounded px-2 py-1.5 text-xs font-medium text-[#5F6368] hover:bg-[#F8F4ED] hover:text-[#481827]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-[#D9DDE3] bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="branch">
              Active branch
            </label>
            <select
              id="branch"
              className="focus-ring min-h-10 rounded border border-[#D9DDE3] bg-white px-3 text-sm font-semibold text-[#481827]"
              defaultValue={staff.activeBranch.id}
            >
              {staff.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <div className="relative min-w-[240px] flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6F263D]"
                size={17}
                aria-hidden
              />
              <label className="sr-only" htmlFor="patient-search">
                Global patient search
              </label>
              <input
                id="patient-search"
                className="focus-ring min-h-10 w-full rounded border border-[#D9DDE3] bg-white pl-10 pr-3 text-sm"
                placeholder="Search patients by name, ID, or mobile"
                type="search"
              />
            </div>
            <button
              className="focus-ring inline-flex min-h-10 w-10 items-center justify-center rounded border border-[#D9DDE3] bg-white text-[#481827]"
              aria-label="Notifications"
              type="button"
            >
              <Bell size={18} aria-hidden />
            </button>
            <Link
              className="focus-ring inline-flex min-h-10 w-10 items-center justify-center rounded border border-[#D9DDE3] bg-white text-[#481827]"
              href="/lock"
              aria-label="Lock workspace"
            >
              <LockKeyhole size={18} aria-hidden />
            </Link>
            <div className="min-w-[180px] rounded border border-[#D9DDE3] bg-[#F8F4ED] px-3 py-2">
              <p className="truncate text-sm font-semibold text-[#262626]">
                {staff.employee.displayName}
              </p>
              <p className="text-xs font-semibold uppercase text-[#6F263D]">
                {staff.activeRole.name}
              </p>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
