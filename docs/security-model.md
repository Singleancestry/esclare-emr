# Security Model

## Principles

ESCLARE stores sensitive patient and medical information. Security must be layered: identity, email verification, strong passwords, MFA for privileged accounts, RBAC, granular permissions, branch restrictions, assigned-patient restrictions, sensitive-record restrictions, step-up authentication, trusted devices, session expiration and immutable audit logging.

## Phase 1 Implementation

- Supabase Auth is the identity system.
- Employees map to Supabase users through `employees.auth_user_id`.
- Roles and permissions are seeded.
- Branch access is represented by `employee_branch_roles`.
- Staff routes require authenticated employee context.
- Sidebar visibility is permission-filtered.
- Database access is protected by RLS helper functions.
- Audit events are immutable from normal application paths.

## Privileged Roles

`owner`, `super_admin`, `branch_manager`, `doctor` and `auditor` are privileged. The seed data marks them as MFA-required. Production login policy must block privileged staff from accessing sensitive routes until MFA is verified.

## Step-Up Actions

The following actions require a fresh authentication check and a justification:

- Refund approval
- Voiding transactions
- Session adjustments
- Price changes
- Medical-record addendums
- Emergency access
- Permission changes

## Data Exposure

Patient contact details are masked by default. Full contact reveal requires `patients.reveal_contact` and creates an audit event. Clinical records and photos require separate permissions and branch checks.

## Offboarding

Disabled employees cannot pass application guards. Supabase sessions must be revoked through an admin service when staff are disabled.
