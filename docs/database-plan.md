# Database Plan

## Phase 1 Scope

Phase 1 creates core platform tables:

- `branches`
- `roles`
- `permissions`
- `role_permissions`
- `employees`
- `employee_branch_roles`
- `trusted_devices`
- `audit_events`
- `rooms`
- `devices`
- `patient_stub_registry`

`patient_stub_registry` is intentionally minimal. Full patient records are introduced in Phase 2, but the registry lets Phase 1 validate patient-search and permission boundaries without storing medical history yet.

## Conventions

- UUID primary keys using `gen_random_uuid()`.
- `created_at` and `updated_at` timestamps.
- Soft archive columns for employee and branch records.
- Branch-scoped operational tables include `branch_id`.
- RLS is enabled on all Phase 1 application tables.

## RLS Strategy

The application stores helper functions in the `public` schema:

- `current_employee_id()`
- `current_employee_has_permission(permission_key text, branch uuid)`
- `current_employee_has_branch(branch uuid)`

Policies use these helpers instead of unrestricted public reads. Audit events are insert-only for authenticated staff and readable only by users with `security.view_audit`.

## Migration Files

- `database/migrations/202607100900_core_security.sql`
- `database/migrations/202607100910_rls_policies.sql`

## Later Tables

Phase 2 adds patients, contact reveals, medical profiles and patient audit histories. Later phases add treatments, prices, packages, appointments, clinical records, POS, inventory, finance and integrations.

## Phase 2 Additions

Migration `database/migrations/202607100920_patient_foundation.sql` adds:

- `patients`
- `patient_branch_links`
- `patient_addresses`
- `patient_emergency_contacts`
- `patient_physical_information`
- `patient_marketing_preferences`
- `patient_privacy_acknowledgements`
- `patient_medical_profiles`
- `patient_contact_reveals`

These tables extend the Phase 1 auth and branch model without rewriting earlier migrations. Medical-profile data is structured intake data only; clinical encounters and treatment records remain Phase 5.
