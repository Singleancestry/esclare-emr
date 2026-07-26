# EaseThetics Live EMR Workflow Map

Date: 2026-07-27

Source: authorized authenticated session at `https://app.easethetics.ph/user/`

Method: read-only structural inspection of navigation, page titles, controls, filters, form field
contracts, and normalized route patterns. No patient chart, employee profile, transaction detail,
calendar event, or row-level record was opened. No create, edit, delete, void, import, export, or
submit action was performed. Names, identifiers, contact details, balances, and clinical data were
not collected.

## Observed module inventory

| Area                  | Live routes and observed workflow surface                                                                                                                    | ESCLARE target status                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Dashboard             | `/user/`                                                                                                                                                     | Staff dashboard exists; parity review remains                                                                  |
| Services and packages | `/user/services`, `/user/import-services/`; add service/package, category and sorting filters, search, import validation, export, bulk selection             | Catalog foundation exists; package ledger and controlled import/export remain                                  |
| Appointments          | `/user/appointment`, `/user/create-appointment`, `/user/appointment-data`; month/day calendar, status/type/date filters, generated views, cancellation state | Appointment foundation exists; source-field mapping and migration tooling remain                               |
| Patient charts        | `/user/patient-chart`; search, groups, filters, bulk selection and a visible delete action                                                                   | Patient foundation exists; clinical chart lifecycle and archive-only replacement remain                        |
| Inventory             | consumables, suppliers, waste, imports, inventory logs, and stock usage; category/search/date filters and export                                             | Placeholder only; movement ledger, supplier, waste, and usage workflows remain                                 |
| Point of sale         | `/user/point-of-sale`                                                                                                                                        | Placeholder only; immutable transaction ledger remains                                                         |
| Accounting            | sales, commissions, employee sales, purchases, expenses, reports, and void logs                                                                              | Placeholder only; invoices, payments, purchases, expenses, commissions, reports, and reversal workflows remain |
| Employees             | employee directory/import/add and attendance                                                                                                                 | Access boundary exists; staff lifecycle and attendance remain                                                  |
| Access control        | system users and user roles                                                                                                                                  | ESCLARE RBAC is implemented in code; live role-by-role parity is unverified                                    |
| Marketing             | SMS and email marketing                                                                                                                                      | Not implemented; consent, suppression, and audit requirements must be approved first                           |
| Audit                 | change/update logs                                                                                                                                           | Append-only audit foundation exists; source event mapping remains                                              |
| Easelife/social       | Easelife and social post/reel navigation                                                                                                                     | Out of the clinical migration critical path pending owner decision                                             |

## Verified workflow contracts

### Services and packages

- Separate add-service and add-package commands are exposed.
- Search, category filtering, sorting, export, import validation, and bulk selection are present.
- Import uses a file-upload contract with a validation step before import.
- The live interface exposes bulk deletion. ESCLARE must replace destructive package/service
  history behavior with archive/versioning where referenced by clinical or financial records.

### Appointments

- Calendar supports month and day views plus previous/next navigation.
- Filters cover status, appointment type, date range, appointment ID, service, and assigned person.
- Offline and Easelife appointment concepts are represented.
- The live surface exposes cancellation and deletion controls. ESCLARE should use status
  transitions and immutable appointment events, retaining a reason and actor.

### Inventory

- Separate domains are exposed for consumables, suppliers, waste, imports, logs, and stock usage.
- Inventory and stock-usage logs support search/date filters and export.
- The live navigation also references product-log and product-usage variants, indicating that the
  replacement schema should distinguish consumables from retail/products.

### Finance

- Sales can be searched by service, customer, or payment terms and filtered by category/date.
- Purchases support vendor/product/receiver search, purchase-order creation, import, and export.
- Expenses support category/date filters, import/export, and expense creation.
- Reports support period/year/month selection and export.
- Dedicated commission, employee-sales, and void-log modules exist, although this account exposed
  no inspectable controls on those pages.

### Staff, roles, and audit

- Employees support job-position filtering, search, import, export, and add-employee flows.
- Attendance, system-user, user-role, and update-log routes are present.
- Those pages exposed no inspectable controls for the current account, so field-level parity and
  authorization behavior are not verified.

## Security and migration findings

1. The live source system is now identified, but no authorized structured export or API contract
   has been obtained. Browser scraping is not an approved migration method.
2. Several live pages expose `Delete` or `Void` commands. No destructive action was tested.
   ESCLARE protected records must use archive, cancellation, reversal, or addendum workflows with
   reasons and append-only audit evidence.
3. Navigation visibility does not prove authorization. The blank/limited staff, role, marketing,
   commission, employee-sales, and void-log surfaces require a role-matrix review with approved
   test accounts.
4. No source record counts, stable source IDs, attachments, package balances, financial totals, or
   audit-event totals were collected. Reconciliation cannot begin until an approved export exists.
5. No patient or employee data should be transferred to Google Drive or Calendar. Supabase remains
   the system of record; Google integrations are limited to encrypted backup metadata and
   minimum-necessary scheduling references after approval.

## Proposed source-to-target mapping

| EaseThetics concept       | ESCLARE target                                                         | Mapping status                    |
| ------------------------- | ---------------------------------------------------------------------- | --------------------------------- |
| Patient chart             | patients, branch links, medical intake, future encounters/addenda      | Partial; clinical schema required |
| Service                   | treatment categories, services, price versions, branch availability    | Foundation available              |
| Package                   | future package purchase and session ledgers                            | Not implemented                   |
| Appointment               | appointments and immutable appointment events                          | Foundation available              |
| Consumable/product        | future inventory items and movement ledger                             | Not implemented                   |
| Sale/payment              | future invoice, receipt, payment, credit, refund, and reversal ledgers | Not implemented                   |
| Purchase/expense          | future purchase and expense ledgers                                    | Not implemented                   |
| Employee/system user/role | employees, branch roles, permissions                                   | Foundation available              |
| Change log                | immutable audit events                                                 | Foundation available              |

## Required next evidence

1. Obtain a vendor-supported, owner-authorized structured export or documented API from
   EaseThetics, including stable IDs and aggregate counts.
2. Create and verify a restorable Supabase staging backup before any import.
3. Approve the clinical, package/session, inventory, and finance ledger schemas.
4. Build an idempotent staging importer with validation, duplicate detection, dry-run reports,
   reconciliation totals, and rollback.
5. Use synthetic accounts and records to test role behavior and workflows. Do not use real patient
   data for development verification.
