# Supabase Security Validation

Static review covered migrations, grants, RLS helpers, function ownership boundaries, audit
writes, patient privacy, appointment mutation, and public appointment requests. New ordered
migrations revoke direct sensitive mutations, mask patient contact, enforce branch context and
required AAL2 inside database permission helpers, and route protected workflows through audited
atomic functions.

Static verifier tests pass. Runtime validation is blocked by missing Supabase credentials, CLI, disposable project, role fixtures, and a production backup.
