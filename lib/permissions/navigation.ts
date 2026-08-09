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
  MessageSquareQuote,
  PackageCheck,
  Settings,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Permission } from "./permissions";
import type { StaffContext } from "./types";
import { hasPermission } from "./checks";
import { isFeatureEnabled, type Feature } from "@/lib/features/flags";

export type NavItem = {
  label: string;
  href: string;
  section: "Daily work" | "Clinical" | "Commerce" | "Management" | "Security";
  icon: ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  permission: Permission;
  feature?: Feature;
  children?: Array<{ label: string; href: string; permission: Permission; feature?: Feature }>;
};

export const mainNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    section: "Daily work",
    icon: LayoutDashboard,
    permission: "dashboard.branch.view",
    feature: "dashboard",
  },
  {
    label: "Appointments",
    href: "/appointments",
    section: "Daily work",
    icon: CalendarDays,
    permission: "appointments.view",
    feature: "appointments",
    children: [
      { label: "Appointment Workspace", href: "/appointments", permission: "appointments.view" },
    ],
  },
  {
    label: "Patients",
    href: "/patients",
    section: "Daily work",
    icon: UsersRound,
    permission: "patients.view_basic",
    feature: "patients",
    children: [
      { label: "Patient Directory", href: "/patients", permission: "patients.view_basic" },
      { label: "Add Patient", href: "/patients/new", permission: "patients.create" },
    ],
  },
  {
    label: "Clinical Records",
    href: "/clinical",
    section: "Clinical",
    icon: BriefcaseMedical,
    permission: "medical.view_summary",
    feature: "clinicalRecords",
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
    section: "Clinical",
    icon: Stethoscope,
    permission: "services.view",
  },
  {
    label: "Packages and Sessions",
    href: "/packages",
    section: "Commerce",
    icon: PackageCheck,
    permission: "packages.view",
    feature: "packages",
  },
  {
    label: "Point of Sale",
    href: "/pos",
    section: "Commerce",
    icon: CircleDollarSign,
    permission: "payments.view",
    feature: "payments",
  },
  {
    label: "Inventory",
    href: "/inventory",
    section: "Management",
    icon: Boxes,
    permission: "inventory.view",
    feature: "inventory",
  },
  {
    label: "Finance",
    href: "/finance",
    section: "Management",
    icon: BarChart3,
    permission: "reports.view_branch",
    feature: "reports",
  },
  {
    label: "Employees",
    href: "/employees",
    section: "Management",
    icon: ContactRound,
    permission: "employees.view",
    feature: "employees",
  },
  {
    label: "Reports",
    href: "/reports",
    section: "Management",
    icon: FileText,
    permission: "reports.view_branch",
    feature: "reports",
  },
  {
    label: "Integrations",
    href: "/integrations",
    section: "Management",
    icon: Activity,
    permission: "prices.view",
    feature: "integrations",
  },
  {
    label: "Reviews Manager",
    href: "/reviews-manager",
    section: "Management",
    icon: MessageSquareQuote,
    permission: "security.manage_roles",
  },
  {
    label: "Settings and Security",
    href: "/settings",
    section: "Security",
    icon: Settings,
    permission: "security.view_audit",
    feature: "securitySettings",
  },
  {
    label: "Administration",
    href: "/admin",
    section: "Security",
    icon: Lock,
    permission: "security.manage_roles",
    feature: "administration",
  },
  {
    label: "Audit",
    href: "/settings/audit",
    section: "Security",
    icon: ClipboardList,
    permission: "security.view_audit",
    feature: "auditRead",
  },
];

export function getAuthorizedNavigation(staff: StaffContext) {
  return mainNavigation
    .filter(
      (item) =>
        hasPermission(staff, item.permission) &&
        (!item.feature || isFeatureEnabled(item.feature, staff.employee.id)),
    )
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) =>
          hasPermission(staff, child.permission) &&
          (!child.feature || isFeatureEnabled(child.feature, staff.employee.id)),
      ),
    }));
}
