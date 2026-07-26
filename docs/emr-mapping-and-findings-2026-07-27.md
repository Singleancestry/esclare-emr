# ESCLARE EMR Mapping and Findings

Date: 2026-07-27

Branch: `codex/emr-mapping-20260727`

Baseline commit: `2baebe7fe8548aeac6196112bac258499bb42e35`

## Scope and evidence

This is a redacted, read-only mapping of the repository and locally available environment. It is
based on the application routes, server actions, permission code, feature flags, database
migrations, verification SQL, existing runbooks, and automated tests. No patient record, payment,
appointment, Supabase row, Google file, or Google Calendar event was created or modified.

The local workspace has no `.env` or `.env.local` file. The existing backup evidence states that
there is no Supabase CLI, database URL, backup credential, isolated restore target, or verified
production migration record in this workspace. Production data testing and migration therefore
remain blocked by the required safety gate.

## Architecture and data flow

1. Public pages live under `app/(public)`. Public appointment requests are validated by Zod in a
   server action. Persistence is feature-gated and requires the server-only Supabase admin client
   plus a rate-limit secret. Without those requirements, the form prepares an inquiry for an
   official contact channel and does not claim confirmation.
2. Authentication pages live under `app/(auth)`. Supabase Auth is the identity provider. Staff
   users map to `employees`, and branch-scoped roles map through `employee_branch_roles`.
3. Staff pages live under `app/(staff)`. The staff layout evaluates authenticated employee status,
   MFA assurance for privileged accounts, route permission, branch permission, and feature state.
4. Browser clients use the anon Supabase client only. Sensitive reads and reviewed writes use
   server-only clients. Service-role credentials are not referenced from client components.
5. Database authorization uses PostgreSQL RLS plus permission helpers. Later hardening migrations
   revoke direct authenticated access and expose reviewed, service-role-only atomic RPCs.
6. Audit events are append-only. Update and delete triggers reject mutation. Sensitive contact
   reveal is designed to write access evidence before returning contact fields.

## Current module map

| Module                      | Current implementation                                                                                             | Release state                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Authentication              | Supabase sign-in, sign-out, recovery, callback, employee context, privileged MFA boundary                          | Implemented; production account testing not performed |
| Permissions                 | Branch-scoped RBAC, route guards, permission-filtered navigation, database helpers                                 | Implemented in code and migrations                    |
| Patients                    | Registration, directory, profile summary, masked contact, audited contact reveal, duplicate fingerprint protection | Pilot; production migrations unverified               |
| Patient editing/archive     | Archive route and permissions exist; full lifecycle actions are absent                                             | Deferred                                              |
| Appointments                | Request inbox, appointment creation, status transitions, overlap constraints, append-only events                   | Pilot; production migrations unverified               |
| Public booking              | Pending request/prepared inquiry with replay protection and rate-limit design                                      | Persistence off by default                            |
| Clinical records            | Protected placeholder only                                                                                         | Off                                                   |
| Clinical photos/attachments | No storage bucket workflow or record model                                                                         | Off                                                   |
| Packages/sessions           | Protected placeholder; patient fields are explicitly demo counters, not a ledger                                   | Off                                                   |
| POS/payments/credits        | Protected placeholder; no transaction ledger                                                                       | Off                                                   |
| Finance                     | Protected placeholder                                                                                              | Off                                                   |
| Inventory                   | Protected placeholder                                                                                              | Off                                                   |
| Reports/exports             | Protected placeholder; export feature off                                                                          | Off                                                   |
| Staff management            | Protected route boundary only                                                                                      | Off                                                   |
| Integrations                | Protected placeholder; Google Sheets mock contract only                                                            | Off                                                   |

## Database inventory

Implemented schema families:

- Identity and access: branches, app users, employees, roles, permissions, branch roles, trusted
  devices, rooms, devices, and immutable audit events.
- Patient foundation: patients, branch links, addresses, emergency contacts, physical information,
  marketing preferences, privacy acknowledgements, medical intake profiles, and contact reveals.
- Treatment catalog: categories, services, price versions, service prices, and branch availability.
- Scheduling: public appointment requests, appointments, appointment events, provider/room/patient
  overlap constraints, atomic create and transition functions, and replay-safe request functions.

Not implemented:

- Signed clinical encounters, addenda, consent artifacts, clinical photographs, and attachments.
- Package purchases, session ledgers, package expiration, redemption, or adjustments.
- Invoices, receipts, payments, credits, refunds, voids, or immutable financial ledgers.
- Inventory movement, reporting exports, migration staging, Google Drive backup, or Google Calendar
  mapping/synchronization tables.

## Security review

Verified in source and automated tests:

- Production feature defaults fail closed.
- Privileged staff require AAL2 before a staff context is returned.
- Server actions repeat feature, permission, and branch checks.
- Patient registration, appointment writes, request transitions, and contact reveal use atomic RPC
  designs with audit evidence.
- Sensitive patient columns and operational tables are revoked from direct authenticated access by
  the hardening migrations.
- Appointment events and audit events are protected from mutation.
- Public appointment requests do not collect clinical history or payment information.

Unverified against production:

- Whether migrations `202607181100` through `202607181390` were applied.
- Live JWT role and branch behavior for each staff role.
- Supabase backup completeness, restore success, storage privacy, and production RLS behavior.
- Production feature flags, MFA enrollment, session expiry, and staff offboarding.

## Findings register

| ID      | Finding                                                                     | Expected                                                       | Actual                                                         | Severity      | Classification                | Decision                                                            |
| ------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | ------------- | ----------------------------- | ------------------------------------------------------------------- |
| EMR-001 | Production backup and restore evidence unavailable                          | Restorable backup before any data mutation                     | No usable evidence or credential in workspace                  | Critical gate | Required                      | Block all synthetic production writes and migration                 |
| EMR-002 | Hardened migrations are not proven applied                                  | Verified production schema and grants                          | Source-reviewed files only                                     | High          | Required                      | Run staging restore and verification before pilot                   |
| EMR-003 | Most requested EMR lifecycle modules are placeholders                       | Working clinical, package, finance, file, and export workflows | Feature-disabled placeholder pages                             | High          | Requires redesign             | Do not represent these modules as complete                          |
| EMR-004 | Patient balance and remaining-session fields are demo counters              | Ledger-derived immutable balances                              | `remaining_sessions_demo` and `outstanding_balance_demo`       | High          | Unsafe for production finance | Replace only after approved ledger design                           |
| EMR-005 | No approved migration source was supplied                                   | Structured authorized export and mapping                       | No source file/database/API available                          | Critical gate | Required                      | Do not import or infer patient data                                 |
| EMR-006 | Local runtime has no Supabase configuration                                 | Isolated test project for Reagan-Test                          | Development fallback only                                      | High          | Required                      | Synthetic persistence testing deferred                              |
| EMR-007 | Public request omits contact details by design                              | Minimum-necessary request plus approved contact workflow       | Name and preferences only; user continues via official channel | Low           | Relevant and beneficial       | Retain until privacy-approved contact storage exists                |
| EMR-008 | Protected-route visual inspection was unavailable in the controlled browser | Read-only local protected-route review                         | Browser policy rejected the protected route                    | Medium        | Test limitation               | Rely on source/unit evidence; require authorized staging smoke test |
| EMR-009 | Middleware convention warning                                               | Supported current Next.js convention                           | Build warns that middleware should migrate to proxy            | Low           | Optional enhancement          | Defer; unrelated to patient-data gate                               |

## Decision record

### Create Reagan-Test

- Classification: required test, currently blocked.
- Reason: no configured isolated Supabase target and no verified backup/restore evidence.
- Safety impact: creating the record could modify an unknown production project or produce false
  assurance through the development fallback.
- Decision: do not create a mock-only patient or claim persistence success.
- Rollback requirement: verified isolated database snapshot plus archive/cleanup procedure.

### Patient-data migration

- Classification: required, currently blocked.
- Reason: no authorized source export, field map, destination backup, stable source identifiers, or
  reconciliation baseline is available.
- Decision: no export, import, merge, or production mutation.
- Required next evidence: approved source, aggregate counts, encrypted private backup location,
  isolated restore, destination schema verification, idempotency key strategy, and rollback plan.

### Clinical, package, and finance implementation

- Classification: required for the requested full EMR, but requires owner/clinical policy.
- Reason: consent rules, package validity, refund policy, clinical documentation standards, and
  practitioner scope cannot be inferred safely.
- Decision: keep features off and design ledgers/addenda before implementation.

## Baseline verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 16 files and 78 tests.
- `npm run env:check`: passed for the documented variable-name contract; this does not prove that
  runtime secrets are configured.
- `npm run build`: passed, 81 routes generated.
- Build warning: Next.js middleware convention is deprecated.
- Diode catalog unit test: all 14 areas and 84 prices match the approved matrix.

## Gate to continue

Before Stage 2, provide or establish all of the following in an authorized non-production target:

1. Supabase project identity and a restorable backup identifier.
2. Isolated restore/test project with the ordered migrations applied and verification SQL passing.
3. A synthetic staff account with appropriate branch permissions and MFA where required.
4. Confirmation that notifications, analytics, and payment providers are disabled for test data.
5. Approved archive/cleanup policy for Reagan-Test.

Before patient migration, additionally provide the approved structured export, source system,
stable identifiers, aggregate reconciliation totals, and owner-approved field mapping.
