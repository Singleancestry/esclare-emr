# Security Checklist

- Supabase Auth enabled.
- Email verification required.
- Privileged staff MFA required.
- Service-role key never exposed to browser.
- RLS enabled on application tables.
- Permission checks enforced server-side.
- Branch access enforced in policies and services.
- Sensitive actions require justification.
- Audit events are immutable from normal admin flows.
- Protected records use archive/reversal/addendum workflows instead of permanent deletion.
- Google Sheets exports exclude medical and authentication data.
