import { redirect } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import { evaluateStaffContext } from "@/lib/auth/access-policy";
import { getCurrentStaffContext } from "@/lib/auth/session";

export default async function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const staff = await getCurrentStaffContext();
  const access = evaluateStaffContext(staff);

  if (!access.allowed) {
    redirect("/login");
  }

  return <StaffShell staff={access.staff}>{children}</StaffShell>;
}
