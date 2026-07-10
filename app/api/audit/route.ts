import { NextResponse } from "next/server";
import { recordAuditEvent } from "@/lib/audit/audit-events";
import { getCurrentStaffContext } from "@/lib/auth/session";

export async function POST(request: Request) {
  const staff = await getCurrentStaffContext();

  if (!staff) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { action?: string; reason?: string };
  await recordAuditEvent({
    actorEmployeeId: staff.employee.id,
    actorRole: staff.activeRole.key,
    branchId: staff.activeBranch.id,
    action: body.action ?? "audit.test",
    entityType: "system",
    reason: body.reason,
    success: true,
  });

  return NextResponse.json({ ok: true });
}
