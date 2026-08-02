# ESCLARE EMR Reference Audit and Implementation Matrix

Date: 2026-07-30

## Scope and Safety Boundaries

The Easethetics installation was inspected as a workflow reference only. The audit did not copy
source code, branding, patient records, transaction records, or inventory records. No reference
record was created, edited, deleted, exported, imported, paid, consumed, or otherwise changed.

The requested `Reagan-Test` reference-system record was not created during the read-only pass.
Creating it would write to an external production system and remains a separately confirmable test
action. Equivalent workflow testing should first use ESCLARE's isolated local test data.

## Reference Navigation Audit

Observed reference areas:

- Dashboard with sales, appointments, used sessions, and inventory summaries
- Services and package management, including category and import tools
- Appointment calendar, list filters, booking, status filters, and booking settings
- Patient chart with search, groups, filters, add, import, and export
- Inventory items, products, suppliers, waste, imports, logs, and stock usage
- Point of sale, payments, transaction history, promotions, and session usage
- Accounting sales, commissions, employee sales, purchases, expenses, reports, and void logs
- Employees, attendance, system users, and user roles
- Easelife integration
- SMS, email, and social-media marketing
- Machine Repair and FAQ placeholder links

Observed weaknesses that must not be copied:

- Marketing and merchant promotions dominate the operational dashboard.
- Machine Repair and FAQ are placeholder `#` links.
- Several visible destructive bulk-delete controls lack clear contextual safeguards.
- Import and export actions are prominent without visible permission or privacy context.
- Appointment creation mixes patient registration, service sale, payment, and scheduling in one
  dense form.
- The reference sidebar has many destinations and inconsistent grouping depth.

## Required Implementation Matrix

| Reference Feature             | Current ESCLARE Status                                       | Classification          | Decision                                  | Required Changes                                                                                     | Risk     | Owner Confirmation Needed |
| ----------------------------- | ------------------------------------------------------------ | ----------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------- | ------------------------- |
| Branch-aware dashboard        | Released launcher with active branch and role                | Required                | Redesign, do not copy                     | Add real operational summaries only when backed by authorized queries; never fabricate values        | Medium   | No                        |
| Patient directory and search  | Released with branch-scoped data and masked contact handling | Required                | Keep and improve                          | Add global search facets and retain privacy-safe contact reveal                                      | High     | No                        |
| Patient creation              | Released with validation and atomic registration RPC         | Required                | Keep and improve                          | Preserve duplicate screening, privacy acknowledgement, and audit event                               | High     | No                        |
| Patient profile/history       | Basic profile released; clinical history incomplete          | Required                | Requires staged implementation            | Add medical, treatment, package, payment, file, and follow-up tabs behind permissions                | High     | Clinical confirmation     |
| Appointment calendar/list     | Scheduler and request inbox released                         | Required                | Improve                                   | Separate list/calendar modes, preserve branch context, add doctor-availability rules                 | High     | Schedule confirmation     |
| Combined booking/payment form | Not copied                                                   | Poorly implemented      | Reject                                    | Keep scheduling, clinical work, and payment as linked but separately auditable workflows             | High     | No                        |
| Service catalog and prices    | Released read-only management catalog                        | Required                | Keep                                      | Add controlled create/propose/approve/publish flows in a later complete slice                        | Medium   | Price approval roles      |
| Treatment records             | Feature-gated placeholder                                    | Required                | Requires redesign                         | Implement encounter lifecycle, alerts, consent, notes, practitioner, and immutable signing           | Critical | Doctor confirmation       |
| Packages and session balances | Secure schema foundation; UI feature-gated                   | Required                | Implement next after clinical contracts   | Use an append-only usage and adjustment ledger; prevent negative or double consumption               | Critical | Package policies          |
| Point of sale and payments    | Feature-gated placeholder                                    | Required                | Implement after package ledger            | Separate transaction, tender, receipt, void, refund, and approval records                            | Critical | Finance policy            |
| Inventory and stock usage     | Feature-gated placeholder                                    | Relevant and beneficial | Implement later                           | Use batches, expirations, immutable stock movements, treatment consumption, and reasoned adjustments | High     | Inventory workflow        |
| Suppliers and purchases       | Not implemented                                              | Relevant and beneficial | Implement with inventory                  | Add supplier and receiving records without exposing unrestricted exports                             | Medium   | Procurement workflow      |
| Sales and financial reports   | Feature-gated placeholders                                   | Required                | Implement only from authoritative ledgers | Branch-scope all queries and restrict exports                                                        | High     | Report definitions        |
| Employees and attendance      | Feature-gated placeholder                                    | Relevant and beneficial | Implement later                           | Keep staff identity, employment state, branch assignment, and auth account separate                  | High     | HR workflow               |
| Roles and permissions         | Permission matrix and RLS foundation exist                   | Required                | Keep and harden                           | Add management UI only after negative authorization tests cover every mutation                       | Critical | No                        |
| Import tools                  | No general EMR imports exposed                               | Optional enhancement    | Defer                                     | Require dry-run validation, duplicate report, transaction boundary, and audit artifact               | High     | Data owner approval       |
| Export tools                  | Feature-gated                                                | Optional enhancement    | Restrict                                  | Explicit permission, minimum necessary fields, reason, watermark, and audit event                    | Critical | Data owner approval       |
| Easelife integration          | Not implemented                                              | Not relevant now        | Reject                                    | No change                                                                                            | Low      | No                        |
| SMS marketing                 | Feature-gated placeholder existed                            | Excluded                | Remove                                    | Remove staff route, feature flag, navigation, shortcuts, and role surface                            | Medium   | No                        |
| Email marketing               | Feature-gated placeholder existed                            | Excluded                | Remove                                    | Remove staff route, feature flag, navigation, shortcuts, and role surface                            | Medium   | No                        |
| Social-media marketing        | Feature-gated placeholder existed                            | Excluded                | Remove                                    | Remove staff route, feature flag, navigation, shortcuts, and role surface                            | Medium   | No                        |
| Machine Repair                | Not present in ESCLARE                                       | Excluded                | Keep absent                               | Add route test to prevent introduction                                                               | Low      | No                        |
| EMR Support FAQ               | Not present in staff app; public clinic FAQ is separate      | Excluded from EMR only  | Keep staff app absent                     | Do not remove the public website FAQ                                                                 | Low      | No                        |

## Initial Findings Register

| ID      | Severity | Finding                                                                                                     | Evidence                                                                    | Action                                                                                    |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| EMR-001 | High     | Several domain pages are placeholders and must not be enabled as if complete.                               | Feature flags default them off and pages use `ProtectedPlaceholder`.        | Keep gated until complete end-to-end slices exist.                                        |
| EMR-002 | Medium   | Staff marketing still exists in route, feature-flag, navigation, and role code despite explicit exclusion.  | `/marketing`, `ENABLE_MARKETING`, navigation item, and `marketing` role.    | Remove from active application code and add regression tests.                             |
| EMR-003 | High     | Current route tests cover only a subset of navigation destinations.                                         | Existing Playwright route tests sample released and gated routes.           | Add a navigation-contract test that validates every authorized item and child link.       |
| EMR-004 | Medium   | Staff-shell colors are repeated literals rather than a complete semantic EMR token layer.                   | Staff layout and pages use repeated maroon, border, and surface hex values. | Introduce semantic staff tokens incrementally without changing public branding.           |
| EMR-005 | Critical | Clinical, package, payment, and inventory workflows cannot be safely released from placeholder pages alone. | Schema/UI coverage is incomplete across those domains.                      | Implement one audited vertical slice at a time; do not widen RLS to make UI queries pass. |
| EMR-006 | Medium   | The reference system exposes placeholder and marketing links that reduce operational clarity.               | `#` support links and marketing-heavy dashboard observed.                   | Do not reproduce them.                                                                    |

## Phase Decision

The first implementation phase is limited to exclusion cleanup, navigation-contract hardening, and
semantic staff-navigation improvements. Clinical, package, payment, inventory, reporting, and staff
management features remain disabled until their database contracts, permissions, audit events,
validation, and end-to-end tests are complete.
