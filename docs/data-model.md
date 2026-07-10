# Data Model

Phase 1 establishes identity and authorization tables. The model is branch-aware from the start.

- `branches`: clinic branches such as ESCLARE Naga and ESCLARE Daet.
- `employees`: staff profiles linked to Supabase Auth users.
- `roles`: named role records.
- `permissions`: granular permission keys.
- `role_permissions`: role-to-permission mapping.
- `employee_branch_roles`: branch-scoped employee role assignments.
- `trusted_devices`: remembered devices for staff accounts.
- `audit_events`: immutable security and domain activity log.
- `rooms`: branch rooms or beds.
- `devices`: branch clinical devices.

Later phases extend this model with patients, clinical records, appointments, treatments, POS, packages, inventory, finance and integrations.

## Phase 2 Patient Model

- `patients`: master patient identity, masked-by-default contact fields, branch ownership, alert level and soft archive fields.
- `patient_branch_links`: branch access linkage for patients who may visit more than one branch.
- `patient_addresses`, `patient_emergency_contacts`, `patient_physical_information`: registration supporting tables.
- `patient_marketing_preferences`: referral and separate SMS/email marketing consent.
- `patient_privacy_acknowledgements`: privacy notice and identity-verification evidence.
- `patient_medical_profiles`: structured intake profile and alert level, not treatment records.
- `patient_contact_reveals`: permission-gated contact reveal log that complements immutable `audit_events`.
