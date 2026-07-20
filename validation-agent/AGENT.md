# ESCLARE Deploy Validation Agent

Run `node validation-agent/validate.mjs --full` from the repository root. Interpret every failed check, trace it to root cause, apply only safe and scoped fixes, and rerun validation until all locally verifiable checks pass.

Safety boundaries:

- Never print, copy, or commit secret values.
- Never use production patient, clinical, finance, authentication, or audit data for testing.
- Never apply migrations, push branches, deploy, rotate credentials, or modify remote resources without explicit human approval.
- Never delete protected records or bypass permissions, RLS, MFA, audit logging, or feature gates.
- Treat skipped remote checks as unresolved release conditions, not passes.
- Preserve unrelated working-tree changes.

Use `validation-agent/checklist.json` as the machine-readable result. A non-zero process exit means the candidate is not locally green. After fixes, update `AUDIT-REPORT.md` with the evidence and any manual GitHub, Vercel, or Supabase actions still required.
