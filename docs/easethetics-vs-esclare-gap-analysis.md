# Easethetics Reference vs ESCLARE Gap Analysis

Date: 2026-08-02
Status: Phase 21 working register

No source code, proprietary assets, credentials, or patient data were copied. The reference was
observed only through the owner's authorized interface.

| Area                 | Reference behavior observed                            | ESCLARE now                                            | Gap / recommendation                            | Priority | Complexity | Security/data impact | Owner decision      | Status    |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------- | -------- | ---------- | -------------------- | ------------------- | --------- |
| Dashboard            | Dense sales, appointment, session, and stock summaries | Branch-aware launcher                                  | Add only reconciled metrics with source links   | P2       | M          | financial visibility | metric definitions  | deferred  |
| Patients             | Search, filters, groups, import/export                 | Branch-scoped directory, registration, masked contacts | Add auditable chart tabs and duplicate workflow | P1       | H          | clinical/privacy     | clinical fields     | partial   |
| Appointments         | Calendar/list, statuses, booking settings              | Requests, appointments, conflict constraints           | Improve calendar modes and resources            | P1       | H          | scheduling integrity | availability rules  | partial   |
| Clinical chart       | Broad chart workflow                                   | Medical profile foundation; clinical UI gated          | Versioned encounters, notes, consent, photos    | P0       | H          | patient safety       | doctor approval     | not ready |
| Services/prices      | Categories, services, packages, import/export          | Catalog and price-version schema                       | Controlled proposal/approval/publish UI         | P1       | M          | historical prices    | approval roles      | partial   |
| Packages             | Sales and session use                                  | Policy/refund schema foundation                        | Immutable entitlement/usage ledger UI           | P0       | H          | finance integrity    | package policies    | not ready |
| POS/accounting       | Sales, payment, reports, commissions, voids            | Feature-gated placeholders                             | Immutable sale/tender/refund/reversal ledger    | P0       | H          | financial integrity  | finance rules       | not ready |
| Inventory            | Items, suppliers, waste, logs, usage                   | Feature-gated placeholder                              | Batch/expiry/branch transaction ledger          | P1       | H          | stock integrity      | units/workflow      | not ready |
| Employees            | Profiles, attendance, roles                            | Identity and branch-role foundation                    | Employment lifecycle and access revocation      | P1       | M          | access control       | HR policy           | partial   |
| Reporting            | Filters, exports, comparisons                          | Gated reports                                          | Build only from authoritative ledgers           | P2       | H          | privacy/finance      | report definitions  | deferred  |
| Imports/exports      | Prominent general tools                                | Mostly gated                                           | Dry run, reason, minimum fields, audit artifact | P2       | H          | migration/privacy    | data owner approval | deferred  |
| Marketing            | SMS, email, social modules                             | Removed from staff EMR                                 | Keep excluded                                   | P4       | L          | lowers exposure      | none                | complete  |
| Support placeholders | Machine repair and FAQ links                           | Not present in staff EMR                               | Keep absent; public clinic FAQ remains          | P4       | L          | none                 | none                | complete  |

## Current Phase 21 Status

PHASE 21 PARTIALLY COMPLETE - LIMITATIONS LISTED. Foundation documentation and released patient/
appointment slices exist. Clinical, package, finance, inventory, employee, and authoritative reporting
slices remain gated until their policies, schema contracts, RLS tests, and end-to-end tests are complete.
