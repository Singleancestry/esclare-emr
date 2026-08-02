# ESCLARE EMR Domain Model

Date: 2026-08-02
Status: staged target model; not a migration

The existing Supabase schema is retained. This document defines bounded additions only after owner
workflow approval, backup, staging migration, RLS review, and rollback testing.

## Existing Foundations

| Domain            | Existing tables                                                                                                                                  | Status                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| Identity/security | branches, app_users, employees, roles, permissions, role_permissions, employee_branch_roles, trusted_devices, audit_events                       | Retain and harden           |
| Patients          | patients, patient_branch_links, addresses, emergency_contacts, physical_information, privacy_acknowledgements, medical_profiles, contact_reveals | Released foundation         |
| Scheduling        | appointment_requests, appointments, appointment_events, rooms, devices                                                                           | Released controlled slice   |
| Catalog           | service_categories, services, price_versions, service_prices, branch_services                                                                    | Read-only management slice  |
| Packages          | package policy, patient package, acceptance, validity, refund, calculation, and remedy tables                                                    | Schema foundation; UI gated |

## Proposed Additions

Each UUID table includes `created_at`, `created_by`, branch scope where operational, and archival
fields where legal retention permits. Signed, financial, audit, and ledger records are immutable.

| Entity group                                                  | Purpose and key relationships                                        | Constraints/indexes                                            | Retention/audit/RLS                                    | Migration approach                      |
| ------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------- |
| patient_alerts                                                | Safety alerts linked to patient and branch                           | index active severity; no duplicate active alert fingerprint   | clinical retention; every change audited; clinical RLS | add after alert policy approval         |
| consultations, treatment_plans                                | Assessment and approved care plan linked to patient/practitioner     | branch/patient/date indexes; signed version immutable          | clinical retention; assigned-care RLS                  | stage with synthetic data               |
| treatment_sessions, treatment_parameters                      | Encounter, service, practitioner, machine, and parameter history     | unique session reference; no silent update after signing       | addendum-only; audited; clinical RLS                   | after doctor template approval          |
| clinical_notes, clinical_note_versions                        | Versioned notes and signatures                                       | monotonically increasing version per note                      | retain all versions; signed records immutable          | add with negative permission tests      |
| consent_templates, consent_template_versions, signed_consents | Exact rendered consent and signer evidence                           | unique template version; signed snapshot hash                  | legal retention review; protected RLS                  | owner-approved content only             |
| patient_photos, photo_access_logs                             | Protected media metadata and access history                          | storage object unique; patient/category/date indexes           | private bucket; signed URL; download audit             | storage threat model first              |
| package_templates, package_sessions, package_adjustments      | Entitlement ledger and corrections                                   | idempotency key; no negative balance; unique usage event       | immutable ledger; finance/clinical RLS                 | reconcile with existing package tables  |
| sales, sale_items, payments                                   | Transaction and tender history                                       | unique transaction/receipt; amount checks; branch/date indexes | financial retention; immutable completion              | finance policy and test ledger first    |
| refunds, financial_adjustments, expenses                      | Reasoned corrections linked to original records                      | refund not above eligible paid amount                          | approval and audit mandatory                           | dual-control workflow                   |
| products, inventory_items, inventory_batches                  | Catalog and lot/expiry stock by branch                               | unique SKU/branch/batch; expiry indexes                        | archive catalog; inventory RLS                         | add before stock import                 |
| inventory_transactions                                        | Receive, use, transfer, damage, loss, return, and adjustment ledger  | idempotency key; source/destination checks                     | immutable ledger; reason and actor required            | derive balances from ledger             |
| suppliers, purchase_orders, purchase_order_items              | Procurement and receiving                                            | unique PO per branch; status transition checks                 | financial retention; branch RLS                        | add after procurement workflow approval |
| commissions, shifts, attendance                               | Staff operations and derived compensation                            | unique staff/shift/day where applicable                        | HR/finance retention review; restricted RLS            | defer until payroll policy exists       |
| notifications, tasks                                          | Operational follow-up without clinical details in unsecured channels | status/due indexes; no secrets                                 | archive when resolved; branch RLS                      | add after notification policy           |
| exports, data_import_jobs                                     | Controlled export/import evidence and exception reports              | checksum, idempotency key, actor, reason                       | audit retention; owner/admin only                      | staging-only before production          |

## Non-Negotiable Invariants

- Historical prices are referenced by immutable price-version IDs.
- Completed sales are corrected through linked void/refund/adjustment records.
- Package usage and inventory balance changes always create ledger entries.
- Signed clinical records receive addenda, never replacement.
- Patient media is never public and access is logged where practical.
- No new policy may use unrestricted access to patient, clinical, financial, or audit data.
