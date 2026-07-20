# Remediation Cycle 2

Starting score: **5.8/10**. Reconciled score after this cycle: **6.8/10**. Target:
evidence-based **8.5/10**.

## Changes

- Added fail-closed `off | pilot | on` feature scope with production pilot allowlisting.
- Hid and direct-route guarded unfinished modules; guarded patient/appointment actions and contact API.
- Removed demo finance/package metrics, unfinished patient tabs/actions, dead shell controls, and fake lock link.
- Added real sign-out and safe post-login service-catalog destination.
- Closed staff-context AAL1 metadata disclosure in migration `1360`.
- Added request quota index `1370`, identity-table lockdown `1380`, operational-table lockdown
  `1385`, and self-validating release marker `1390`.
- Added privacy-safe liveness/readiness and structured operational event envelopes.
- Added Supabase cookie refresh through Edge middleware; Next.js 16 Node proxy remains deferred
  until OpenNext supports Node middleware.
- Prevented hero replay after completion.

## Evidence And Limits

Final local evidence is clean: formatting, lint, strict type checking, 63/63 unit tests, the
42-route production build, 70/70 public production-style browser cases, and 35/35 separate
synthetic staff browser cases across five Playwright projects. Supabase backup/restore, staging migration,
live JWT/RLS, concurrency, GitHub/Vercel exact commit, production smoke, alert delivery, and named
owners require external access. These remain active score caps and prevent an 8.5 award.

Valid stop condition: external access and unsafe production-operation gate. No production state is
changed in this cycle.
