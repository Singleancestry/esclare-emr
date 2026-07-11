# Implementation Roadmap

## Phase 1

- Initialize Next.js project.
- Create design system foundation.
- Configure Supabase Auth boundaries.
- Create employee, role, permission and branch models.
- Add core migrations, RLS policies and safe seed data.
- Build authenticated staff layout.
- Build dashboard shell.
- Add unit tests for permissions and validation.

## Phase 2

Patient directory, registration, patient profile, medical profile and audit logs.

Implemented in this phase:

- Patient directory card and table views with branch/search filtering.
- Masked patient contact display with permission-gated reveal action.
- Multi-step patient registration form with Philippine mobile validation, calculated age and BMI.
- Patient profile shell with requested tabs and medical-profile visibility rules.
- Patient foundation migration, RLS policies and fictional seed data.
- Audit log page for patient and security events.

## Phase 3

Treatment catalog, prices, packages and Google Sheets import and approval.

In progress:

- Added a management-sourced treatment catalog and public regular-price view.
- Added versioned service pricing, branch availability and permission-aware RLS foundations.
- Added the complete July 2026 4D Diode package matrix to the application catalog.
- Google Sheets staging, approval workflow UI and complete database seeding remain outstanding.

## Phase 4

Appointments, calendar, resource scheduling and booking rules.

## Phase 5

Clinical encounters, treatment templates, body map, consent, clinical photographs and signatures.

## Phase 6

POS, payments, package ledger and session usage.

## Phase 7

Inventory, finance and reports.

## Phase 8

Public website, public booking and patient portal.

## Phase 9

Security hardening, full test suite, documentation and deployment configuration.
