# ESCLARE EMR Findings Register

Date: 2026-07-27

Scope: redacted read-only EaseThetics workflow inspection, ESCLARE source review, and baseline
automated tests. No patient chart, employee profile, transaction detail, or row-level source record
was opened. No live write, import, export, delete, void, payment, notification, or migration action
was performed.

Status values: `Pass`, `Fail`, `Limited`, or `Deferred`. Severity values describe the consequence if
the observed behavior were carried into production, not whether the source system is defective.

## Register

| ID    | Function or workflow                 | Module or screen              | Expected behavior                                                                         | Actual behavior                                                                                                            | Result   | Severity | Classification               | Current EMR             | New EMR relevance | Reusable learning                                          | Change authorized and in scope                                      |
| ----- | ------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | ---------------------------- | ----------------------- | ----------------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| F-001 | Service/package discovery            | EaseThetics Services          | Staff can find active services and packages without exposing records                      | Search, category, sorting, bulk selection, add, import validation, and export controls observed                            | Limited  | Medium   | Relevant and beneficial      | Yes                     | Yes               | Catalog discovery and validated import are useful          | Documentation only; implementation deferred                         |
| F-002 | Service/package deletion             | EaseThetics Services          | Referenced catalog history is preserved                                                   | A bulk `Delete` control is visible; behavior was not executed                                                              | Limited  | High     | Requires redesign before use | Yes                     | Yes               | Replacement must use archive/versioning                    | Archive-only design is authorized; live testing is not              |
| F-003 | Service import validation            | EaseThetics Import Management | File is validated before import and failures are recoverable                              | File upload and `Validate File` contract observed                                                                          | Limited  | High     | Required                     | Yes                     | Yes               | Staged validation is appropriate                           | Import implementation deferred until schema/export approval         |
| F-004 | Appointment calendar/filtering       | EaseThetics Appointment       | Staff can locate appointments by status, type, date, service, and assignee                | Month/day calendar and expected filters observed                                                                           | Pass     | Medium   | Required                     | Yes                     | Yes               | Preserve operational filter coverage                       | Mapping is authorized; parity implementation deferred               |
| F-005 | Appointment cancellation/deletion    | EaseThetics Appointment       | Historical appointments remain auditable                                                  | Cancel and delete concepts are exposed; no write was attempted                                                             | Limited  | High     | Requires redesign before use | Yes                     | Yes               | Use status transitions and immutable events                | ESCLARE transition model is authorized; source write testing is not |
| F-006 | Patient directory discovery          | EaseThetics Patient Chart     | Search and grouping locate records without exposing unnecessary data                      | Search, groups, filters, and bulk-selection controls observed                                                              | Limited  | High     | Required                     | Yes                     | Yes               | Search/filter coverage is useful                           | Mapping only; patient records must not be scraped                   |
| F-007 | Patient deletion                     | EaseThetics Patient Chart     | Protected patient history cannot be permanently deleted                                   | A visible `Delete` control was observed; behavior was not executed                                                         | Limited  | Critical | Unsafe                       | Yes                     | Yes               | ESCLARE must use archive with reason/audit                 | Archive-only rule is authorized; no source action authorized        |
| F-008 | Inventory operations                 | EaseThetics Inventory         | Consumables, products, suppliers, waste, and usage are traceable                          | Separate navigation and search/date/export contracts observed; row contents were not inspected                             | Limited  | High     | Requires redesign before use | Yes                     | Yes               | Distinguish consumables from retail products               | Data-model design deferred                                          |
| F-009 | Sales, payments, purchases, expenses | EaseThetics Accounting/POS    | Financial history is immutable, reconcilable, and reversible                              | Sales, POS, purchases, expenses, reports, commissions, employee sales, and void logs exist                                 | Limited  | Critical | Requires redesign before use | Yes                     | Yes               | Separate ledgers and reversals are required                | Financial policy and schema require owner confirmation              |
| F-010 | Employee directory                   | EaseThetics Employees         | Authorized staff can manage employees by role and branch                                  | Search, job-position filter, import/export, and add-employee controls observed                                             | Limited  | High     | Relevant and beneficial      | Yes                     | Yes               | Role/branch-scoped lifecycle is useful                     | Field-level transfer deferred                                       |
| F-011 | Roles and system users               | EaseThetics Settings          | Navigation and actions reflect enforced authorization                                     | Routes exist but current account exposed no inspectable controls                                                           | Limited  | High     | Required                     | Yes                     | Yes               | Navigation visibility is not an enforcement boundary       | Approved synthetic role accounts required                           |
| F-012 | Change/audit logs                    | EaseThetics Update Logs       | Sensitive actions produce immutable audit evidence                                        | Route exists but current account exposed no inspectable controls                                                           | Limited  | Critical | Required                     | Yes                     | Yes               | Append-only audit remains mandatory                        | ESCLARE audit foundation is in scope                                |
| F-013 | SMS/email marketing                  | EaseThetics Marketing         | Messages require consent, suppression, authorization, and audit                           | Routes exist but current account exposed no inspectable controls                                                           | Limited  | High     | Requires owner confirmation  | Yes                     | Optional          | Feature existence does not justify transfer                | No implementation until consent/communications policy approval      |
| F-014 | Patient registration validation      | ESCLARE registration schema   | Date of birth cannot be in the future                                                     | Schema validates date format but has no upper-bound check; age utility can return a negative age                           | Fail     | High     | Required                     | No confirmed equivalent | Yes               | Reject future dates at UI/server/database boundaries       | Yes; non-clinical data-integrity fix                                |
| F-015 | Duplicate patient prevention         | ESCLARE atomic registration   | Concurrent equivalent registrations cannot create duplicates                              | Advisory transaction lock plus normalized identity fingerprint and duplicate error observed                                | Pass     | Critical | Required                     | Not tested              | Yes               | Stable identifiers first; ambiguous matches require review | Existing behavior retained                                          |
| F-016 | Contact reveal privacy               | ESCLARE patient directory/API | Clear permission, reason, audit, and masked default are enforced                          | Masked contact defaults and reason-gated audited reveal flow observed in source                                            | Pass     | Critical | Required                     | Not tested              | Yes               | Minimum-necessary display is appropriate                   | Existing behavior retained                                          |
| F-017 | Appointment status transitions       | ESCLARE appointments          | Only allowed transitions commit atomically with history/audit                             | Zod transition rules, permission checks, atomic RPC, and tests observed                                                    | Pass     | Critical | Required                     | Not tested              | Yes               | Status transition model is preferable to deletion          | Existing behavior retained                                          |
| F-018 | Package/session balances             | ESCLARE patient data          | Remaining sessions derive from an immutable ledger                                        | Current patient fields are explicitly demo counters; package module is disabled                                            | Fail     | Critical | Requires redesign before use | Yes                     | Yes               | Never infer or decrement counters without a ledger         | Not authorized without package policy/schema approval               |
| F-019 | Financial balances                   | ESCLARE patient data          | Balances derive from immutable invoice/payment/credit ledgers                             | Current balance field is explicitly a demo counter; finance/POS are disabled                                               | Fail     | Critical | Requires redesign before use | Yes                     | Yes               | Prevent duplicate payments and preserve historical values  | Not authorized without financial policy/schema approval             |
| F-020 | Production migration                 | EaseThetics to ESCLARE        | Authorized structured export, backup, idempotency, and reconciliation exist before import | Source system is identified, but no approved export/API, backup evidence, stable-ID map, or reconciliation baseline exists | Deferred | Critical | Required gate                | Yes                     | Yes               | Browser scraping is not an approved migration method       | No production migration authorized                                  |

## Reproduction and impact details

### F-001 to F-013: live EaseThetics workflow structure

- Reproduction: sign in with an authorized staff account; navigate only to the module routes listed
  in `docs/easethetics-live-emr-map-2026-07-27.md`; inspect visible navigation, controls, filter names,
  and normalized route patterns without opening record details or triggering actions.
- Likely cause: these are existing source-system workflow surfaces. Blank or limited pages may be
  role-restricted, asynchronously populated, or unavailable to the current account; this was not
  bypassed.
- Data involved: structural UI metadata only. No names, contact details, medical details, balances,
  transaction references, record identifiers, or row values were retained.
- Privacy/security impact: high if bulk delete, import/export, role, marketing, or record-level
  actions are copied without server authorization, minimum-necessary access, and audit controls.
- Historical-record impact: delete/void behavior could destroy or obscure history if implemented as
  destructive mutation.
- Financial impact: sales, purchase, expense, commission, package, and void behavior cannot be
  trusted until ledger and reconciliation rules are approved.
- Patient-safety/operational impact: appointment, patient, package, and treatment workflows affect
  continuity of care and must retain clear status/history.
- Recommended action: transfer requirements and workflow intent only. Redesign destructive and
  weakly evidenced behaviors; use approved synthetic accounts for deeper role testing.

### F-014: future date of birth accepted

- Reproduction: parse an otherwise valid registration payload with a date of birth later than the
  current date. The current Zod schema accepts the value because it checks ISO date syntax only.
  `calculateAge` then returns a negative value.
- Likely cause: missing upper-bound validation in the registration schema and database write path.
- Data involved: synthetic date only.
- Privacy/security impact: no direct disclosure; invalid identity data can weaken duplicate
  screening and matching.
- Historical-record impact: an invalid date can become part of the permanent patient identity and
  duplicate fingerprint.
- Financial impact: indirect risk if identity mismatch connects appointments or transactions to the
  wrong record.
- Patient-safety/operational impact: high data-quality risk for patient identification and age-based
  review.
- Recommended action: reject future dates in Zod, add a database-side guard, and add regression
  tests. Do not impose a maximum patient age without owner/clinical confirmation.

### F-015 to F-017: implemented safety foundations

- Reproduction: review source and run the focused patient/appointment/permission unit tests.
- Likely cause: intentional hardening migrations and server-side permission checks.
- Data involved: synthetic test fixtures only.
- Privacy/security impact: beneficial; contact reveal and writes remain permission/audit gated.
- Historical-record impact: beneficial; appointment events and audit history are append-only.
- Financial impact: none for these tested functions.
- Patient-safety/operational impact: beneficial, subject to production migration verification.
- Recommended action: retain and verify against an isolated Supabase staging project.

### F-018 and F-019: demo counters instead of ledgers

- Reproduction: inspect `lib/patients/data.ts` and the disabled package, POS, and finance routes.
- Likely cause: phase-one placeholder data was intentionally retained while ledger policy remained
  unapproved.
- Data involved: demo-only counters; no production values inspected.
- Privacy/security impact: low disclosure risk while features remain disabled; high integrity risk if
  enabled as authoritative values.
- Historical-record impact: counters cannot explain adjustments, reversals, usage, or original
  values.
- Financial impact: critical if treated as balances or package entitlements.
- Patient-safety/operational impact: critical for duplicate or negative session deductions.
- Recommended action: keep features off until immutable ledgers, idempotency, reversals, and policy
  decisions are approved.

### F-020: migration gate

- Reproduction: review local environment, migration evidence, and live-source access method.
- Likely cause: vendor export/API and destination backup credentials have not been supplied.
- Data involved: none.
- Privacy/security impact: critical if visual scraping or unencrypted ad hoc export is attempted.
- Historical-record impact: critical without stable IDs and idempotent relationship mapping.
- Financial impact: critical without aggregate reconciliation.
- Patient-safety/operational impact: critical if incomplete or mislinked histories are imported.
- Recommended action: obtain an owner-authorized vendor export/API, private backups, aggregate
  counts, source-to-destination field map, staging restore, and rollback before any data write.

## Baseline verification before changes

- Before implementation, focused patient validation/utilities: 2 files, 7 tests passed.
- After implementation, focused regression suite: 3 files, 24 tests passed.
- Final TypeScript typecheck and lint: passed.
- Final full unit suite: 16 files, 81 tests passed.
- Environment contract: passed with 30 documented variable names.
- Production build: passed with 81 routes and the documented Next.js middleware convention
  warning.
- Patient workflow E2E: 20 tests passed across Chromium, Firefox, WebKit, mobile Chrome, and mobile
  Safari. This covered directory cards/table, weak-mobile rejection, future-date rejection, masked
  contact display, and medical-summary visibility in the development fallback.
- The managed `npm run e2e` wrapper timed out after four minutes while an existing local server held
  port 3000 and produced no test result. The existing server was preserved. The patient suite was
  then run directly against that local server and passed; the wrapper timeout itself remains a test
  runner reliability warning.
- The new SQL migration has source-contract coverage but was not applied to production or an
  isolated Supabase target.
- Production Supabase, write workflows, notifications, payments, exports, and source migration were
  not tested and must not be reported as passing.
