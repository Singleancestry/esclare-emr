import { NextResponse } from "next/server";
import { recordAuditEvent } from "@/lib/audit/audit-events";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { getPatientFullContact, getPatientProfile } from "@/lib/patients/data";
import { hasPermission } from "@/lib/permissions/checks";

export async function POST(request: Request, context: { params: Promise<{ patientId: string }> }) {
  const staff = await getCurrentStaffContext();

  if (!staff || !hasPermission(staff, "patients.reveal_contact")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { patientId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { reason?: string };
  const reason = body.reason?.trim();

  if (!reason) {
    return NextResponse.json({ error: "A reveal reason is required." }, { status: 400 });
  }

  const profile = await getPatientProfile(staff, patientId);

  if (!profile) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }

  const contact = await getPatientFullContact(patientId);

  if (!contact) {
    return NextResponse.json({ error: "Contact details not found." }, { status: 404 });
  }

  const admin = createSupabaseAdminClient();

  if (admin) {
    await admin.from("patient_contact_reveals").insert({
      patient_id: patientId,
      revealed_by: staff.employee.id,
      branch_id: staff.activeBranch.id,
      reason,
      revealed_fields: ["mobile", "email"],
    });
  }

  await recordAuditEvent({
    actorEmployeeId: staff.employee.id,
    actorRole: staff.activeRole.key,
    branchId: staff.activeBranch.id,
    action: "patient.contact_reveal",
    entityType: "patients",
    entityId: patientId,
    patientId,
    reason,
    success: true,
  });

  return NextResponse.json(contact);
}
