import {
  Activity,
  BarChart3,
  Boxes,
  BriefcaseMedical,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  ContactRound,
  FileText,
  LayoutDashboard,
  Lock,
  Megaphone,
  PackageCheck,
  Settings,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Permission } from "./permissions";
import type { StaffContext } from "./types";
import { hasPermission } from "./checks";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  permission: Permission;
  children?: Array<{ label: string; href: string; permission: Permission }>;
};

export const mainNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard.branch.view",
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: CalendarDays,
    permission: "appointments.view",
    children: [
      { label: "Appointment Calendar", href: "/appointments/calendar", permission: "appointments.view" },
      { label: "Appointment List", href: "/appointments", permission: "appointments.view" },
      { label: "New Appointment", href: "/appointments/new", permission: "appointments.create" },
      { label: "Pending Requests", href: "/appointments/pending", permission: "appointments.view" },
      { label: "Doctor Schedule", href: "/appointments/doctors", permission: "appointments.view" },
    ],
  },
  {
    label: "Patients",
    href: "/patients",
    icon: UsersRound,
    permission: "patients.view_basic",
    children: [
      { label: "Patient Directory", href: "/patients", permission: "patients.view_basic" },
      { label: "Add Patient", href: "/patients/new", permission: "patients.create" },
      { label: "Archived Patients", href: "/patients/archived", permission: "patients.archive" },
    ],
  },
  {
    label: "Clinical Records",
    href: "/clinical",
    icon: BriefcaseMedical,
    permission: "medical.view_summary",
    children: [
      { label: "Open Encounters", href: "/clinical/open", permission: "medical.view_summary" },
      { label: "New Treatment Record", href: "/clinical/new", permission: "medical.create" },
      { label: "Signed Records", href: "/clinical/signed", permission: "medical.view_summary" },
      { label: "Addendums", href: "/clinical/addendums", permission: "medical.add_addendum" },
    ],
  },
  {
    label: "Treatments and Services",
    href: "/services",
    icon: Stethoscope,
    permission: "services.view",
  },
  {
    label: "Packages and Sessions",
    href: "/packages",
    icon: PackageCheck,
    permission: "packages.view",
  },
  {
    label: "Point of Sale",
    href: "/pos",
    icon: CircleDollarSign,
    permission: "payments.view",
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Boxes,
    permission: "inventory.view",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: BarChart3,
    permission: "reports.view_branch",
  },
  {
    label: "Employees",
    href: "/employees",
    icon: ContactRound,
    permission: "employees.view",
  },
  {
    label: "CRM and Marketing",
    href: "/marketing",
    icon: Megaphone,
    permission: "patients.view_basic",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
    permission: "reports.view_branch",
  },
  {
    label: "Integrations",
    href: "/integrations",
    icon: Activity,
    permission: "prices.view",
  },
  {
    label: "Settings and Security",
    href: "/settings",
    icon: Settings,
    permission: "security.view_audit",
  },
  {
    label: "Administration",
    href: "/admin",
    icon: Lock,
    permission: "security.manage_roles",
  },
  {
    label: "Audit",
    href: "/settings/audit",
    icon: ClipboardList,
    permission: "security.view_audit",
  },
];

export function getAuthorizedNavigation(staff: StaffContext) {
  return mainNavigation
    .filter((item) => hasPermission(staff, item.permission))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => hasPermission(staff, child.permission)),
    }));
}
