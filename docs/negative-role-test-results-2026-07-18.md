# Negative Role Test Results

Status: **blocked for real authorization evidence**. Local permission unit tests pass, but
they do not use Supabase JWTs, RLS, generated REST/GraphQL APIs, storage, disabled accounts,
expired sessions, or mixed branch roles.

Required matrix: anonymous, patient/client if supported, receptionist, aesthetician, nurse,
doctor, manager, administrator, owner, auditor, and service process. Required denials include
patient/contact/medical/audit/appointment direct access, cross-branch and cross-patient IDs,
future/expired assignments, role mutation, event forgery, clinical photo paths, financial
adjustments, exports, replay, malformed/expired tokens, and suspended users.

No denial is marked passed based on SQL text alone. Real test count: 0. Failed exposure count:
unknown. Verdict: production gate failed due missing environment. Commit: `68bbfbc` plus
uncommitted remediation. Confidence: high.
