"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

type StaffNavLinkProps = {
  href: string;
  className: string;
  children: React.ReactNode;
  exact?: boolean;
};

export function StaffNavLink({ href, className, children, exact = false }: StaffNavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href as Route}
      aria-current={active ? "page" : undefined}
      className={`${className} ${
        active
          ? "bg-[var(--selected-navigation)] text-[var(--primary-emphasis)]"
          : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
      }`}
    >
      {children}
    </Link>
  );
}

type StaffNavDetailsProps = {
  href: string;
  summary: React.ReactNode;
  children: React.ReactNode;
};

export function StaffNavDetails({ href, summary, children }: StaffNavDetailsProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <details className="group/nav" open={active || undefined}>
      <summary
        className={`focus-ring flex min-h-10 cursor-pointer list-none items-center gap-3 rounded px-3 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden ${
          active
            ? "bg-[var(--selected-navigation)] text-[var(--primary-emphasis)]"
            : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
        }`}
      >
        {summary}
      </summary>
      <div className="ml-9 mt-1 grid gap-1 border-l border-[var(--accent-muted)] pl-3">
        {children}
      </div>
    </details>
  );
}
