# ESCLARE Master Command v2.1 Discovery Report

Date: 2026-07-19
Workspace: `C:\Users\intel\Documents\New project-Esclare`
Branch observed: `audit/production-readiness-20260718`

## Verdict

The local source is buildable and testable, but the system is not ready for full live EMR production. It is suitable for continued local/preview hardening and a controlled website-only hosting path after environment variables, GitHub synchronization, and Supabase deployment gates are completed.

Do not enable public booking persistence, clinical EMR, exports, marketing campaigns, referrals, reviews automation, patient portal, or Google integrations in production until staging Supabase access, backup/restore evidence, RLS verification, and integration smoke tests are complete.

## Evidence Collected

- `npm.cmd run build`: passed on 2026-07-18 in this workspace, producing 42 App Router routes.
- `npm.cmd run lint`: passed on 2026-07-18.
- `npm.cmd run typecheck`: passed on 2026-07-18.
- `npm.cmd test`: passed on 2026-07-18 with 14 files and 63 tests.
- `npm.cmd audit --audit-level=high`: passed on 2026-07-19 with 0 vulnerabilities.
- Repository security baseline verification on 2026-07-19: format, lint, typecheck, 14-file/63-test Vitest suite, 42-route production build, dependency audit, and YAML parsing passed locally.
- Local env inventory: only `.env.example` exists. No `.env.local` was present.
- Secret-pattern scan of the workspace found placeholders and docs references only in the current tree; it did not prove full git-history cleanliness.

## Repository Map

- Framework: Next.js App Router, `next@16.2.10`, React 19.
- Runtime target: Node/Next standalone output via `next.config.ts`.
- Styling/build: Tailwind CSS 4, PostCSS, Turbopack build.
- Tests: Vitest unit tests and Playwright E2E tests.
- Database: Supabase/Postgres SQL migrations under `database/migrations`.
- Deployment artifacts/configs present:
  - `next.config.ts` with `output: "standalone"`.
  - `wrangler.jsonc` and `open-next.config.ts` for Cloudflare/OpenNext experimentation.
  - `.openai/hosting.json` exists, so OpenAI Sites tooling has been used.
  - No `.github` workflow directory was present at discovery time; CI, CodeQL, Gitleaks, Dependabot, and CODEOWNERS configuration was subsequently added locally.
  - Vercel docs exist, but no Vercel CLI/auth/project state was verified in this pass.

## Surface Inventory

Public pages observed:

- `/`, `/home`, `/about`, `/branches`, `/branches/daet`, `/contact`, `/treatments`, `/diode-laser`, `/aftercare`, `/appointment-request`, `/faq`, `/gallery`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/icon.png`.

Auth pages observed:

- `/login`, `/lock`.

Staff/protected pages observed:

- `/dashboard`, `/appointments`, `/patients`, `/patients/new`, `/patients/[patientId]`, `/patients/archived`, `/services`, `/admin`, `/settings`, `/settings/audit`, `/clinical`, `/finance`, `/packages`, `/pos`, `/inventory`, `/employees`, `/reports`, `/marketing`, `/integrations`.

API routes observed:

- `/api/health`, `/api/health/live`, `/api/health/ready`, `/api/patients/[patientId]/reveal-contact`.
- `app/api/audit/route.ts` is deleted in the current working tree.

Middleware/proxy:

- `middleware.ts` exists and refreshes Supabase cookies. Next.js 16 reports the `middleware` convention as deprecated and recommends the newer `proxy` convention. This is a warning, not a current build blocker.

## Current Security Posture

Implemented locally or represented in source:

- Fail-closed feature flag inventory for unfinished EMR/staff modules.
- Staff protected placeholders for unfinished domains.
- Server-side Supabase admin helper isolated in `lib/auth/supabase-admin.ts`.
- Permission helpers and route policies under `lib/permissions`.
- Health endpoints split into live/ready checks.
- Database migration set includes atomic booking/patient/contact workflows, branch-scoped staff context, MFA boundary checks, and lockdown migrations through `202607181390_release_readiness_marker.sql`.
- Unit tests cover permissions, access policy, feature flags, validation, operational controls, media behavior, and migration expectations.

Not verified in this pass:

- Production Supabase project settings, RLS state, Auth/MFA settings, storage buckets, or live policies.
- Vercel environment variables, preview/production separation, deployment logs, or live deployment headers.
- Google Calendar/Drive/Gmail OAuth scopes, token storage, webhook behavior, or live integration health.
- Hostinger deployment settings, because Hostinger is planned but not connected from this workspace.
- Full git-history secret scan with a dedicated scanner such as gitleaks/trufflehog.
- Backup and restore into staging.

## Data Inventory From Source

Migration families observed:

- Core security/RLS: `202607100900_core_security.sql`, `202607100910_rls_policies.sql`.
- Patient foundation: `202607100920_patient_foundation.sql`.
- Treatment catalog: `202607110900_treatment_catalog.sql`.
- Public appointment requests: `202607111000_public_appointment_requests.sql`.
- API role grants: `202607120010_api_role_grants.sql`.
- Appointment scheduling: `202607121200_appointment_scheduling.sql`.
- 2026-07-18 hardening migrations: `202607181100` through `202607181390`.

Classification guidance:

- Treatment catalog, published branch info, public FAQs, public media: C1.
- Schedules, inventory, staff operational data, aggregate analytics: C2.
- Patient demographics, appointment history, payment/package records: C3.
- Clinical notes, screening, consents, prescriptions, adverse events, private photos/documents: C4.

Live database schema and RLS could not be independently queried because Supabase credentials and project access are not present locally.

## Integration Inventory

Source/docs mention these integrations:

- Supabase Auth/Postgres/Storage.
- Google Sheets mock/provider env contract.
- Google Calendar/Drive/Gmail are required by the master command but not verified as implemented/live.
- Vercel deployment docs exist.
- GitHub remote was previously identified as `Singleancestry/esclare-emr`, but this pass did not push or open a PR.
- Hostinger is the current intended hosting direction from the user's latest planning request, which differs from the master command's Vercel-only deployment target.

## Debt Inventory

Important debt markers found by `rg`:

- Clinical, finance, package ledger, inventory, report/export, integrations, marketing, archived patients, POS, and employees remain protected placeholder surfaces or controlled-scope modules.
- Demo patient data remains in source for local development and tests, with production fallback guarded to avoid demo substitution.
- Dashboard copy still contains demo/placeholder metric language.
- Public treatment image placeholders remain in CSS/UI.
- No `.github` CI workflow directory was found.
- `.env.local` is missing, so local Supabase-backed integration testing is blocked.

## Dependency Audit

`npm.cmd audit --audit-level=high` returned 0 vulnerabilities on 2026-07-19.

## Critical Findings

1. Production database/security posture is unverified.
   Impact: cannot honestly mark Supabase secure or EMR production-ready.
   Required action: connect staging Supabase first, apply migrations to staging, run verification SQL and adversarial anon/auth role tests.

2. Environment segregation is not proven.
   Impact: preview/live deployments could accidentally point at production data.
   Required action: define dev/staging/prod env matrix and verify hosting environment variables without exposing values.

3. GitHub workflow is locally configured but remotely unverified.
   Impact: branch protection and required checks may still be absent on GitHub.
   Required action: push through a pull request, verify CI/CodeQL/Gitleaks results, and configure protected-branch requirements.

4. EMR and growth/marketing features are not ready for production activation.
   Impact: clinical privacy, booking integrity, consent, and marketing compliance risks.
   Required action: keep feature flags off/pilot and implement only after Supabase gates pass.

## Prioritized Plan

1. Complete governance docs: changelog, decisions, risks, threat model.
2. Push the local GitHub CI and secret-scanning workflows through a pull request and require them in branch protection.
3. Migrate `middleware.ts` to Next.js 16 `proxy` convention after the production hosting target or OpenNext Node-proxy compatibility is confirmed.
4. Create a staging environment checklist for Supabase and Hostinger.
5. Apply and verify migrations only on staging first.
6. Run adversarial RLS/API/storage tests with real staging anon/auth/service contexts.
7. Only then build booking persistence, Calendar/Drive, exports, patient portal, and growth/marketing modules.

## Production Decision

READY FOR LIMITED WEBSITE PREVIEW ONLY.

NOT READY FOR FULL PRODUCTION EMR.
