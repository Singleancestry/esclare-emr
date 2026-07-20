import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { isFeatureEnabled } from "@/lib/features/flags";
import { getPatientProfile } from "@/lib/patients/data";
import { hasPermission } from "@/lib/permissions/checks";

export async function POST(request: Request, context: { params: Promise<{ patientId: string }> }) {
  const staff = await getCurrentStaffContext();

  if (!staff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isFeatureEnabled("patients", staff.employee.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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
  if (!hasPermission(staff, "patients.reveal_contact", profile.homeBranchId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Contact details are unavailable." }, { status: 503 });
  }

  const { data: contact, error } = await admin.rpc("reveal_patient_contact_atomic", {
    p_patient_id: patientId,
    p_branch_id: profile.homeBranchId,
    p_reason: reason,
    p_actor_employee_id: staff.employee.id,
  });
  if (error || !contact) {
    return NextResponse.json(
      { error: "Contact details cannot be revealed until access is recorded." },
      { status: 503 },
    );
  }

  return NextResponse.json(contact);
}
