# Google Drive and Calendar Integration Readiness

Date: 2026-07-27

Status: design gate only; no Google write was performed

## Current state

- The connected Google profile is a clinic account. The read-only connector check found no Shared
  Drives and no folder matching `ESCLARE` or `ESCLARE EMR`. The account address is intentionally
  omitted from this report.
- The application has only a Google Sheets mock-provider environment contract.
- The integrations route is a protected, feature-disabled placeholder.
- No Google Drive backup module, Calendar client, OAuth callback, token store, sync worker, webhook,
  integration audit table, backup manifest, checksum record, or appointment-event mapping exists.
- No Google Drive or Google Calendar environment variables are documented beyond the existing
  Sheets service-account fields.
- No approved Drive/Shared Drive folder, Calendar ID, branch calendar architecture, retention rule,
  encryption-key custody policy, or appointment duration/resource policy is available locally.
- Calendar events were not enumerated during discovery because existing event titles or details may
  contain patient-identifying information. Calendar architecture must be supplied explicitly or
  reviewed in an approved private administrative workflow.

## Source-of-truth boundaries

The following boundaries are required before implementation:

- Supabase remains authoritative for EMR records and appointments.
- Google Drive is a private encrypted backup destination, not a live medical-record database.
- Google Calendar is an operational availability layer, not a patient chart.
- Calendar events use a private internal booking reference and contain no clinical history,
  diagnosis, allergy, photograph, payment balance, package price, or authentication-bypass link.
- A Calendar failure cannot discard a saved appointment request.
- Two-way synchronization stays disabled until field ownership and conflict resolution are approved.

## Proposed minimum data model

These are design candidates, not applied migrations:

- `integration_connections`: provider, status, credential reference, scopes, verified_at, and
  disabled_at. Secrets remain in the deployment secret store, never in this table.
- `integration_audit_events`: provider, action, internal reference, result, retry count, error
  category, resolution status, and timestamp; no patient content.
- `backup_runs`: backup type, encrypted object name, checksum, size, status, verification status,
  retention class, restore-test status, and timestamps.
- `calendar_event_mappings`: appointment ID, calendar ID, event ID, sync status, update marker,
  last synchronized timestamp, and conflict state.
- `integration_jobs`: idempotency key, job type, status, retry schedule, and non-sensitive error
  category for recoverable partial failures.

## Security requirements

- Use the least-privilege Google scopes approved for the selected connection method.
- Keep OAuth refresh tokens or service-account keys server-side and encrypted at rest.
- Do not expose credentials through `NEXT_PUBLIC_*`, client bundles, logs, screenshots, or audit
  payloads.
- Restrict connection, backup, restore, retry, and sync controls to reviewed administrator
  permissions and require reasons for sensitive actions.
- Make Drive folders and Calendar events private by default.
- Use `Asia/Manila` explicitly for appointment synchronization.
- Add idempotency, checksums, retry limits, and compensation states before enabling a worker.

## Decisions requiring owner confirmation

1. Google Workspace account or Shared Drive to use and its authorized administrators.
2. OAuth user delegation versus service account and domain-wide delegation policy.
3. Backup content, encryption method, key custodian, schedule, retention, and legal requirements.
4. Naga and Daet calendar IDs and whether practitioners, rooms, or devices have separate calendars.
5. Treatment durations, operating hours, buffers, closure days, and conflict priority.
6. Whether website requests create tentative private events before staff review.
7. Notification channels and confirmation wording.
8. One-way versus approved two-way synchronization and conflict ownership.

## Gate outcome

No Google authorization, folder creation, file upload, Calendar event creation, sharing change, or
credential write was attempted. Performing those actions now would require inventing operational
rules and could expose patient data or create duplicate appointments. Implementation should begin
only after the EMR staging/backup gate passes and the decisions above are approved.
