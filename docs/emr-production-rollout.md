# EMR Production Rollout

This runbook starts the next EMR phase safely. Do not use real patient data until every gate passes.

## Current Gate

- GitHub and Vercel code deployment is already synced.
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

Apply this file exactly once:

```text
database/migrations/202607121200_appointment_scheduling.sql
```

The migration adds:

- `public.appointment_status`.
- `public.appointments`.
- `public.appointment_events`.
- Provider and room overlap constraints.
- RLS policies for appointment reads, creates, updates, and event inserts.
- Append-only appointment event behavior for authenticated users.

Do not edit or delete existing patient, appointment request, audit, finance, or clinical records during this step.

## Step 3: Verify Migration

Run the read-only verification script:

```text
database/verification/202607121200_appointment_scheduling_check.sql
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
NEXT_PUBLIC_SITE_URL
GOOGLE_SHEETS_PROVIDER
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
GOOGLE_SHEETS_CATALOG_ID
```

`SUPABASE_SERVICE_ROLE_KEY` and Google service account values must be server-only secrets. Never expose them in client code, logs, screenshots, or public docs.

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
