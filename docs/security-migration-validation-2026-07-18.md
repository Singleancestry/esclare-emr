# Security Migration Validation

## Ordered Files

1. `202607121200_appointment_scheduling.sql`
2. `202607181100_harden_audit_and_api_grants.sql`
3. `202607181200_sensitive_patient_column_access.sql`
4. `202607181300_atomic_appointment_workflows.sql`
5. `202607181310_atomic_patient_registration.sql`
6. `202607181320_branch_scoped_staff_context.sql`
7. `202607181330_atomic_appointment_request_workflows.sql`

Source review and seven static migration tests pass. The verifier contradiction around the
removed appointment-event insert policy was corrected. Direct patient, appointment,
patient-link, event, audit, and request mutations are revoked where server-only RPCs own the
workflow. Atomic functions use `SECURITY DEFINER`, fixed search paths, service-role-only
execution, active/future assignment checks, row locks, and audit writes in the transaction.

Database execution status: **not run**. Locking/data checks required before staging include
existing appointment overlaps, duplicate idempotency keys, generated-column impact, function
ownership, schema drift, and lock timeout behavior. Rollback must be tested in restored
staging; source inspection is not rollback proof.

Commands completed: formatting, ESLint, TypeScript, 46 unit tests. Production/staging SQL
output: none. Verdict: source-improved but blocked from application. Confidence: medium for
source design, zero for live database state.
