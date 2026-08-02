import Link from "next/link";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { signOutAction } from "@/app/(auth)/login/actions";
import { StaffNavDetails, StaffNavLink } from "@/components/layout/staff-nav-link";
import { getAuthorizedNavigation } from "@/lib/permissions/navigation";
import type { StaffContext } from "@/lib/permissions/types";

type StaffShellProps = {
  staff: StaffContext;
  children: React.ReactNode;
};

export function StaffShell({ staff, children }: StaffShellProps) {
  const navigation = getAuthorizedNavigation(staff);
  const sections = ["Daily work", "Clinical", "Commerce", "Management", "Security"] as const;
  const groupedNavigation = sections
    .map((section) => ({
      section,
      items: navigation.filter((item) => item.section === section),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#262626] lg:grid lg:grid-cols-[288px_1fr]">
      <aside className="hidden border-r border-[#D9DDE3] bg-white lg:block">
        <div className="flex h-16 items-center border-b border-[#D9DDE3] px-5">
          <Link href="/dashboard" className="font-serif text-2xl font-semibold text-[#6F263D]">
            ESCLARE
          </Link>
        </div>
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4" aria-label="Main">
          <NavigationGroups groups={groupedNavigation} />
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-[#D9DDE3] bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <details className="group relative lg:hidden">
              <summary className="focus-ring flex min-h-10 w-10 cursor-pointer list-none items-center justify-center rounded border border-[#D9DDE3] bg-white text-[#481827] [&::-webkit-details-marker]:hidden">
                <Menu size={19} aria-hidden />
                <span className="sr-only">Open staff navigation</span>
              </summary>
              <nav
                className="absolute left-0 top-12 max-h-[75vh] w-[min(19rem,calc(100vw-2rem))] overflow-y-auto rounded border border-[#D9DDE3] bg-white p-3 shadow-lg"
                aria-label="Mobile main"
              >
                <NavigationGroups groups={groupedNavigation} />
              </nav>
            </details>
            <Link
              href="/dashboard"
              className="font-serif text-xl font-semibold text-[#6F263D] lg:hidden"
            >
              ESCLARE
            </Link>
            <p className="min-w-[180px] flex-1 text-sm font-semibold text-[#481827]">
              {staff.activeBranch.name}
            </p>
            <form action={signOutAction}>
              <button
                className="focus-ring inline-flex min-h-10 w-10 items-center justify-center rounded border border-[#D9DDE3] bg-white text-[#481827]"
                aria-label="Sign out"
                type="submit"
              >
                <LogOut size={18} aria-hidden />
              </button>
            </form>
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

type NavigationGroupsProps = {
  groups: Array<{
    section: string;
    items: ReturnType<typeof getAuthorizedNavigation>;
  }>;
};

function NavigationGroups({ groups }: NavigationGroupsProps) {
  return groups.map((group) => (
    <section key={group.section} className="mb-5 last:mb-0" aria-label={group.section}>
      <h2 className="px-3 pb-1 text-[0.7rem] font-bold uppercase text-[#7A7F86]">
        {group.section}
      </h2>
      <div className="grid gap-1">
        {group.items.map((item) => {
          const Icon = item.icon;
          if (!item.children?.length) {
            return (
              <StaffNavLink
                key={item.href}
                href={item.href}
                exact
                className="focus-ring flex min-h-10 items-center gap-3 rounded px-3 py-2 text-sm font-semibold"
              >
                <Icon size={18} aria-hidden />
                <span>{item.label}</span>
              </StaffNavLink>
            );
          }

          return (
            <StaffNavDetails
              key={item.href}
              href={item.href}
              summary={
                <>
                  <Icon size={18} aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown
                    size={15}
                    className="transition-transform group-open/nav:rotate-180"
                    aria-hidden
                  />
                </>
              }
            >
              {item.children.map((child) => (
                <StaffNavLink
                  key={child.href}
                  href={child.href}
                  exact
                  className="focus-ring rounded px-2 py-2 text-xs font-medium"
                >
                  {child.label}
                </StaffNavLink>
              ))}
            </StaffNavDetails>
          );
        })}
      </div>
    </section>
  ));
}
