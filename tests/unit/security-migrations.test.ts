import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const auditMigration = readFileSync(
  "database/migrations/202607181100_harden_audit_and_api_grants.sql",
  "utf8",
).toLowerCase();
const patientMigration = readFileSync(
  "database/migrations/202607181200_sensitive_patient_column_access.sql",
  "utf8",
).toLowerCase();
const appointmentMigration = readFileSync(
  "database/migrations/202607181300_atomic_appointment_workflows.sql",
  "utf8",
).toLowerCase();
const patientRegistrationMigration = readFileSync(
  "database/migrations/202607181310_atomic_patient_registration.sql",
  "utf8",
).toLowerCase();
const branchPermissionMigration = readFileSync(
  "database/migrations/202607181320_branch_scoped_staff_context.sql",
  "utf8",
).toLowerCase();
const appointmentRequestMigration = readFileSync(
  "database/migrations/202607181330_atomic_appointment_request_workflows.sql",
  "utf8",
).toLowerCase();
const contactRevealMigration = readFileSync(
  "database/migrations/202607181340_atomic_contact_reveal.sql",
  "utf8",
).toLowerCase();
const operationalIndexMigration = readFileSync(
  "database/migrations/202607181350_operational_query_indexes.sql",
  "utf8",
).toLowerCase();
const databaseMfaMigration = readFileSync(
  "database/migrations/202607181360_enforce_database_mfa_boundary.sql",
  "utf8",
).toLowerCase();
const requestRateLimitIndexMigration = readFileSync(
  "database/migrations/202607181370_appointment_request_rate_limit_index.sql",
  "utf8",
).toLowerCase();
const identityLockdownMigration = readFileSync(
  "database/migrations/202607181380_lock_down_identity_tables.sql",
  "utf8",
).toLowerCase();
const releaseMarkerMigration = readFileSync(
  "database/migrations/202607181390_release_readiness_marker.sql",
  "utf8",
).toLowerCase();
const operationalLockdownMigration = readFileSync(
  "database/migrations/202607181385_lock_down_operational_tables.sql",
  "utf8",
).toLowerCase();

describe("security hardening migrations", () => {
  it("prevents authenticated clients from forging audit and appointment history", () => {
    expect(auditMigration).toContain("drop policy if exists audit_events_insert_staff");
    expect(auditMigration).toContain("revoke insert on table public.audit_events");
    expect(auditMigration).toContain("drop policy if exists appointment_events_staff_insert");
    expect(auditMigration).toContain("revoke insert on table public.appointment_events");
  });

  it("uses an explicit authenticated function allowlist", () => {
    expect(auditMigration).toContain(
      "revoke execute on all functions in schema public from public, anon, authenticated",
    );
    expect(auditMigration).toContain(
      "grant execute on function public.get_staff_context() to authenticated",
    );
    expect(auditMigration).not.toContain(
      "grant execute on all functions in schema public to authenticated",
    );
  });

  it("denies direct authenticated access to sensitive patient tables", () => {
    expect(patientMigration).toContain("masked_mobile text generated always");
    expect(patientMigration).toContain(
      "revoke select, insert, update, delete on table public.patients",
    );
    expect(patientMigration).toContain(
      "revoke insert, update, delete on table public.patient_branch_links",
    );
    expect(patientMigration).toContain(
      "revoke select on table public.patient_medical_profiles from authenticated, anon",
    );
  });

  it("commits appointment state, history, and audit events atomically", () => {
    expect(appointmentMigration).toContain("create_appointment_atomic");
    expect(appointmentMigration).toContain("transition_appointment_atomic");
    expect(appointmentMigration).toContain("for update");
    expect(appointmentMigration).toContain("appointments_patient_no_overlap");
    expect(appointmentMigration).toContain(
      "revoke execute on function public.transition_appointment_atomic",
    );
    expect(appointmentMigration).toContain("to service_role");
  });

  it("commits patient registration and its audit event atomically", () => {
    expect(patientRegistrationMigration).toContain("create_patient_atomic");
    expect(patientRegistrationMigration).toContain("insert into public.patient_branch_links");
    expect(patientRegistrationMigration).toContain("insert into public.patient_medical_profiles");
    expect(patientRegistrationMigration).toContain("insert into public.audit_events");
    expect(patientRegistrationMigration).toContain(
      "revoke execute on function public.create_patient_atomic",
    );
    expect(patientRegistrationMigration).toContain("pg_advisory_xact_lock");
  });

  it("preserves permissions per branch and rejects future assignments", () => {
    expect(branchPermissionMigration).toContain("branchpermissions");
    expect(branchPermissionMigration).toContain("ebr.starts_at <= pg_catalog.now()");
    expect(branchPermissionMigration).toContain("permissions_by_branch");
  });

  it("makes public request creation and staff transitions atomic and replay-safe", () => {
    expect(appointmentRequestMigration).toContain("idempotency_key");
    expect(appointmentRequestMigration).toContain("on conflict (idempotency_key) do nothing");
    expect(appointmentRequestMigration).toContain("transition_appointment_request_atomic");
    expect(appointmentRequestMigration).toContain("insert into public.audit_events");
    expect(appointmentRequestMigration).toContain("request_fingerprint");
    expect(appointmentRequestMigration).toContain("pg_advisory_xact_lock");
    expect(appointmentRequestMigration).toContain("interval '15 minutes'");
  });

  it("records both contact-reveal logs before returning sensitive data", () => {
    expect(contactRevealMigration).toContain("reveal_patient_contact_atomic");
    expect(contactRevealMigration).toContain("insert into public.patient_contact_reveals");
    expect(contactRevealMigration).toContain("insert into public.audit_events");
    expect(contactRevealMigration).toContain("to service_role");
  });

  it("indexes patient, request, and audit queries by their operational filters", () => {
    expect(operationalIndexMigration).toContain("audit_events_patient_created_at_idx");
    expect(operationalIndexMigration).toContain("patients_branch_name_active_idx");
    expect(operationalIndexMigration).toContain("appointment_requests_branch_submitted_active_idx");
  });

  it("enforces required MFA inside database authorization helpers", () => {
    expect(databaseMfaMigration).toContain("current_employee_mfa_satisfied()");
    expect(databaseMfaMigration).toContain("auth.jwt() ->> 'aal'");
    expect(databaseMfaMigration).toContain("= 'aal2'");
    expect(databaseMfaMigration).toContain("select public.current_employee_mfa_satisfied()");
    expect(databaseMfaMigration).toContain("get_staff_context_unchecked");
    expect(databaseMfaMigration).toContain(
      "revoke execute on function public.get_staff_context_unchecked() from public, anon, authenticated",
    );
    expect(databaseMfaMigration).toContain(
      "revoke execute on function public.current_employee_mfa_satisfied() from public, anon",
    );
  });

  it("indexes the public request abuse-control lookup", () => {
    expect(requestRateLimitIndexMigration).toContain(
      "appointment_requests_fingerprint_submitted_idx",
    );
    expect(requestRateLimitIndexMigration).toContain("request_fingerprint, submitted_at desc");
    expect(requestRateLimitIndexMigration).toContain("where request_fingerprint is not null");
  });

  it("revokes direct client access to identity and authorization tables", () => {
    expect(identityLockdownMigration).toContain("public.app_users");
    expect(identityLockdownMigration).toContain("public.employee_branch_roles");
    expect(identityLockdownMigration).toContain("public.trusted_devices");
    expect(identityLockdownMigration).toContain("from anon, authenticated");
    expect(identityLockdownMigration).toContain("to service_role");
    expect(identityLockdownMigration).toContain("drop policy if exists role_permissions_manage");
  });

  it("requires prior security controls before reporting the schema ready", () => {
    expect(releaseMarkerMigration).toContain("create_patient_atomic");
    expect(releaseMarkerMigration).toContain("current_employee_mfa_satisfied");
    expect(releaseMarkerMigration).toContain("appointment_requests_fingerprint_submitted_idx");
    expect(releaseMarkerMigration).toContain(
      "not has_table_privilege('authenticated', 'public.app_users', 'select')",
    );
    expect(releaseMarkerMigration).toContain(
      "not has_table_privilege('authenticated', 'public.audit_events', 'insert')",
    );
  });

  it("prevents pilot users from bypassing server services with direct table reads", () => {
    expect(operationalLockdownMigration).toContain("public.appointments");
    expect(operationalLockdownMigration).toContain("public.appointment_requests");
    expect(operationalLockdownMigration).toContain("public.audit_events");
    expect(operationalLockdownMigration).toContain("from anon, authenticated");
    expect(operationalLockdownMigration).toContain("to service_role");
  });
});
