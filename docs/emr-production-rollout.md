# EMR Production Rollout

This runbook starts the next EMR phase safely. Do not use real patient data until every gate passes.

## Current Gate

- GitHub `main` and Vercel are synced to the pre-audit commit `68bbfbc`.
- The audited remediation branch is uncommitted and is not deployed.
- Live public site and Supabase Auth reachability were verified through Vercel.
- Production Supabase schema changes are not applied from this workspace because there is no local Supabase CLI, production database URL, or backup credential.

## Required Access

Before applying database changes, confirm access to:

- Supabase project owner/admin account.
- Supabase database backup/export capability.
- Vercel project settings.
- At least one safe test staff account for each role: owner, branch manager, receptionist, doctor, auditor.

## Step 1: Backup Supabase

Create a backup before any migration.

Preferred options:

- Supabase dashboard backup if available on the project plan.
- `pg_dump` from a trusted machine with the production database connection string.
- Supabase CLI database dump from a trusted machine.

Record:

- Backup timestamp.
- Backup method.
- Person who created the backup.
- Restore location or file name.

Do not continue unless the backup is complete and restorable.

## Step 2: Apply Appointment Scheduling Migration

Apply these files exactly once, in order:

```text
database/migrations/202607121200_appointment_scheduling.sql
database/migrations/202607181100_harden_audit_and_api_grants.sql
database/migrations/202607181200_sensitive_patient_column_access.sql
database/migrations/202607181300_atomic_appointment_workflows.sql
database/migrations/202607181310_atomic_patient_registration.sql
database/migrations/202607181320_branch_scoped_staff_context.sql
database/migrations/202607181330_atomic_appointment_request_workflows.sql
database/migrations/202607181340_atomic_contact_reveal.sql
database/migrations/202607181350_operational_query_indexes.sql
database/migrations/202607181360_enforce_database_mfa_boundary.sql
database/migrations/202607181370_appointment_request_rate_limit_index.sql
database/migrations/202607181380_lock_down_identity_tables.sql
database/migrations/202607181385_lock_down_operational_tables.sql
database/migrations/202607181390_release_readiness_marker.sql
```

The migration adds:

- `public.appointment_status`.
- `public.appointments`.
- `public.appointment_events`.
- Provider, room, and patient overlap constraints.
- RLS policies for appointment reads, creates, updates, and event inserts.
- Server-only atomic create/transition functions that commit appointment state,
  append-only history, and audit events together.
- Server-only atomic patient registration that commits the patient, required intake
  records, and audit event together.
- Branch-scoped permission context that rejects future-dated assignments.
- Replay-safe public request creation and optimistic staff request transitions.
- Atomic contact reveal that records both access ledgers before returning sensitive fields.
- Growth-aligned indexes for patient, appointment-request, assignment, room, and audit reads.

Do not edit or delete existing patient, appointment request, audit, finance, or clinical records during this step.

## Step 3: Verify Migration

Run the read-only verification script:

```text
database/verification/202607121200_appointment_scheduling_check.sql
database/verification/202607181100_harden_audit_and_api_grants_check.sql
database/verification/202607181200_sensitive_patient_column_access_check.sql
database/verification/202607181300_atomic_appointment_workflows_check.sql
database/verification/202607181310_atomic_patient_registration_check.sql
database/verification/202607181320_branch_scoped_staff_context_check.sql
database/verification/202607181330_atomic_appointment_request_workflows_check.sql
database/verification/202607181340_atomic_contact_reveal_check.sql
database/verification/202607181350_operational_query_indexes_check.sql
database/verification/202607181360_enforce_database_mfa_boundary_check.sql
database/verification/202607181370_appointment_request_rate_limit_index_check.sql
database/verification/202607181380_lock_down_identity_tables_check.sql
database/verification/202607181385_lock_down_operational_tables_check.sql
database/verification/202607181390_release_readiness_marker_check.sql
```

Every `passed` value should be `true`.

If any check fails:

1. Stop.
2. Do not route staff to the appointment workspace.
3. Capture the failed check output.
4. Restore from backup or repair through a reviewed migration.

## Step 4: Confirm Vercel Environment Variables

In Vercel production settings, confirm these variables exist:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
APPOINTMENT_REQUEST_RATE_LIMIT_SECRET
NEXT_PUBLIC_SITE_URL
GOOGLE_SHEETS_PROVIDER
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
GOOGLE_SHEETS_CATALOG_ID
```

`SUPABASE_SERVICE_ROLE_KEY`, `APPOINTMENT_REQUEST_RATE_LIMIT_SECRET`, and Google service account values must be server-only secrets. Never expose them in client code, logs, screenshots, or public docs.

## Step 5: Staff Role Smoke Test

Use safe test accounts only.

For each role:

- Owner: can access admin, audit, patients, appointments.
- Branch manager: can access branch-scoped staff workflows.
- Receptionist: can create and manage appointment requests/appointments within branch permissions.
- Doctor: can view appropriate patient/clinical summaries according to permissions.
- Auditor: can view audit logs but cannot mutate operational records.

Confirm blocked screens show clear access-denied behavior instead of leaking data.

## Step 6: Appointment Workflow Smoke Test

Use fictional test patient and service data.

Test:

1. Create an appointment.
2. Confirm it.
3. Check in.
4. Start treatment.
5. Complete treatment.
6. Cancel another appointment with a reason.
7. Mark another appointment no-show with a reason.
8. Attempt overlapping provider and room times and confirm the database rejects them.
9. Confirm `appointment_events` records are appended.
10. Confirm authenticated users cannot update or delete `appointment_events`.
11. Force an event or audit insert failure in staging and confirm the appointment write rolls back.
12. Run two simultaneous transitions from the same starting status and confirm only one commits.

## Step 7: Next Feature Phase

After scheduling is verified, begin clinical encounters:

- Encounter shell.
- SOAP notes.
- Treatment record templates.
- Consent tracking.
- Clinical-photo access controls.
- Doctor-only procedure notes.
- Addendum workflow instead of editing locked history.

Do not store real clinical records or clinical photographs until backup, retention, MFA, role tests, and privacy governance gates are complete.
