# ESCLARE Threat Model

Date: 2026-07-19

## Assets

- C4 clinical/sensitive: clinical notes, screening answers, consents, prescriptions, adverse events, private before/after photos, uploaded documents.
- C3 patient PII: names, DOB, contact details, addresses, appointment history, package/payment records.
- C2 operational: schedules, branch/provider availability, room/equipment plans, inventory, aggregate analytics.
- C1 public: treatment content, public FAQs, branch info, published images with consent.
- Secrets: Supabase service-role key, Google OAuth/service-account credentials, webhook secrets, rate-limit secrets, health-check tokens.
- Integrity assets: booking slots, appointment status, package balances, prices/promos, audit logs, clinic reputation.

## Actors And Controls

### Anonymous Internet Attacker

Entry points: public pages, appointment request form, health endpoints, static media, robots/sitemap, public Supabase anon access if configured.

Current reach from source: public website and appointment-request surface; live Supabase exposure not tested because credentials are absent.

Controls in source: server-side validation, rate-limit secret contract, health readiness split, protected staff routes, public booking persistence disabled by default.

Residual risk: live anon table/storage exposure remains unverified until staging/production Supabase testing is performed.

### Malicious Or Curious Patient

Entry points: future patient portal, booking management tokens, patient-specific routes, document downloads.

Current reach from source: patient portal is not production-ready; staff patient routes are protected.

Controls in source: non-guessable workflows are planned; permission helpers exist; protected routes are gated.

Residual risk: patient-owner RLS and signed URL policies must be adversarially tested with real Supabase contexts before portal launch.

### Booking Abuser

Entry points: appointment request form, future booking slot reservation, promo validation.

Current reach from source: public appointment request exists; persistence is controlled by feature flag.

Controls in source: appointment request validation, rate-limit index migration, atomic appointment workflow migrations, idempotency-oriented SQL functions.

Residual risk: concurrent last-slot booking must be tested against staging database, not only migration text/unit expectations.

### Malicious Insider

Entry points: staff shell, patients, reports, exports, audit pages, branch-scoped records.

Current reach from source: staff surfaces exist; several sensitive modules are hidden or protected placeholders.

Controls in source: permission matrix, branch-scoped staff context functions, MFA boundary migration, sensitive patient column access restrictions, audit-read feature flag.

Residual risk: branch isolation and clinical-read logging require staging RLS tests with multiple synthetic users.

### Departed Staff

Entry points: lingering Supabase Auth sessions, Google OAuth grants, staff role assignments.

Current reach from source: session helpers and staff status checks exist; live session revocation was not tested.

Controls in source: active/inactive staff concepts and guarded route access.

Residual risk: account deactivation must be proven to revoke active sessions/tokens in Supabase and Google integrations.

### Compromised Third Party

Entry points: npm dependencies, Google APIs, hosting provider, Supabase outage, webhook spoofing.

Current reach from source: Google integrations are not live-verified; dependency audit currently reports 0 high vulnerabilities.

Controls in source: lockfile committed, minimized env contracts, integration failure docs, pinned GitHub Actions, locked CI install, dependency audit gate, CodeQL, Gitleaks, and Dependabot configuration.

Residual risk: remote CI, Dependabot, CodeQL/SAST, and full-history Gitleaks execution remain unverified until a pull request runs. Webhook signature tests and Google token encryption are also not verified.

### Prompt-Injection Attacker

Entry points: future chatbot, free-text booking fields, patient notes rendered in admin, third-party review/blog content.

Current reach from source: rule-based chatbot is not confirmed as built; free-text fields exist in forms.

Controls in source: master command requires restricted C1-only knowledge base and output filtering.

Residual risk: no dedicated chatbot injection test suite was observed in this pass.

### Automated Bots

Entry points: booking, contact, quiz, promo validation, login.

Current reach from source: appointment request form and login page.

Controls in source: validation and rate-limit secret contract.

Residual risk: CAPTCHA escalation, IP/session throttling, login enumeration resistance, and production monitoring are not verified live.

## Required Abuse-Case Tests

- Anon Supabase role attempts to select every C3/C4 table: must fail.
- Patient A attempts to read Patient B record/document: must fail.
- Naga staff attempts to read Daet records without permission: must fail.
- Receptionist attempts to read clinical notes: must fail.
- Ordinary admin attempts to read integration secrets/tokens: must fail.
- Storage URL guessing for private photos/documents: must fail.
- Disabled staff session attempts protected route/API access: must fail.
- Concurrent booking race for one slot: exactly one succeeds.
- Idempotency replay for booking creation: one booking only.
- Bad webhook signature: rejected.
- CSV injection payload in export: neutralized.
- XSS payload in free-text fields/blog/reviews/admin rendering: neutralized.

## Incident Readiness

`INCIDENT-RESPONSE.md` defines severity levels, evidence preservation, containment playbooks, a DPO/legal notification decision gate, draft notification content, and kill-switch verification criteria. Provider-specific contacts and production commands remain intentionally absent until they can be configured without exposing secrets.
