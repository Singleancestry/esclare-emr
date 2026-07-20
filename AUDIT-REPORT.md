# ESCLARE Production Readiness Audit

Audit date: 2026-07-19  
Branch: `audit/production-readiness-20260718`  
Committed base: `68bbfbced9930a76abcb95e007b8aee7dd3e97c1`

## Executive Summary

**Verdict: GO WITH CONDITIONS.** The local release candidate builds successfully and passes formatting, strict TypeScript, lint, 70 unit tests, 21 critical Chromium flows, responsive checks at five viewport sizes, dependency and full-history secret scans, Lighthouse, and local load/stress tests. The application has enforced security headers, server-side staff route protection, server-side input validation, bounded operational queries, and RLS declarations for every locally defined operational table. Production release is not yet authorized because the candidate contains a large uncommitted change set, 13 new database migrations have not been compared with or applied to the remote project, and GitHub/Vercel/Supabase authenticated state and production environment variables could not be verified from this machine. No production resource was changed.

## Architecture And Route Inventory

- Next.js 16.2.10 App Router, React 19.2, strict TypeScript, Tailwind CSS 4, npm, Node 22 target.
- Public marketing routes are primarily static/SSG. Booking uses a validated server action and Supabase when configured.
- Authentication uses Supabase Auth. Staff routes are protected in the server layout and domain permissions are enforced in server work and RLS.
- PostgreSQL, Auth, Storage, and RLS configuration are represented by 20 ordered SQL migrations under `database/migrations`.

| Route group                                                                                    | Purpose                              |  Auth | Data source                          |
| ---------------------------------------------------------------------------------------------- | ------------------------------------ | ----: | ------------------------------------ |
| `/home`, `/about`, `/contact`, `/faq`, `/gallery`, `/aftercare`, `/privacy`, `/terms`          | Public clinic content                |    No | Static content/assets                |
| `/treatments`, `/treatments/[slug]`, `/diode-laser`                                            | Treatment discovery                  |    No | Local catalog/assets                 |
| `/skin-education`, article/category routes                                                     | Education library                    |    No | Local content                        |
| `/branches`, `/branches/daet`                                                                  | Location information                 |    No | Static clinic data                   |
| `/appointment-request`                                                                         | Public booking request               |    No | Supabase via validated server action |
| `/login`, `/lock`                                                                              | Authentication and locked-session UI |    No | Supabase Auth                        |
| `/dashboard`, `/appointments`, `/patients`, `/clinical`, `/pos`                                | Core staff and clinical workflows    |   Yes | Supabase/RLS                         |
| `/packages`, `/inventory`, `/finance`, `/reports`, `/employees`, `/marketing`, `/integrations` | Operational modules                  |   Yes | Supabase/RLS and feature flags       |
| `/admin`, `/settings`, `/settings/audit`                                                       | Administration and audit             |   Yes | Supabase/RLS/permission checks       |
| `/api/health`, `/api/health/live`                                                              | Public liveness                      |    No | Application runtime                  |
| `/api/health/ready`                                                                            | Private dependency readiness         | Token | Supabase, bounded timeout            |
| `/api/patients/[patientId]/reveal-contact`                                                     | Audited contact reveal               |   Yes | Supabase atomic RPC/RLS              |

## Validation Results

The final `npm run validate` equivalent completed with **13/13 checks passing**. The machine-readable result is `validation-agent/checklist.json`.

| Check                                             | Result                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| Fresh lockfile install check                      | PASS; isolated `npm ci --ignore-scripts` also completed          |
| Prettier                                          | PASS                                                             |
| Environment contract                              | PASS; 30 variable names documented                               |
| ESLint                                            | PASS                                                             |
| Strict TypeScript                                 | PASS                                                             |
| Unit tests                                        | PASS; 70/70                                                      |
| Critical Chromium E2E                             | PASS; 21/21                                                      |
| Production Safari media/hero E2E                  | PASS; 14/14 across desktop and mobile WebKit                     |
| Responsive production checks                      | PASS; 6/6 across 360x800, 390x844, 768x1024, 1366x768, 1920x1080 |
| Dependency audit                                  | PASS; 0 known vulnerabilities                                    |
| Working tree and complete Git-history secret scan | PASS                                                             |
| Next.js production build                          | PASS; 76 static pages generated                                  |
| Load smoke                                        | PASS; zero errors                                                |
| Lighthouse                                        | PASS                                                             |

API negative tests returned controlled responses: unsupported health method `405`, private readiness without authorization `404`, unauthenticated reveal requests `403`, malformed reveal input `403` before parsing, and unknown routes `404`. The readiness code applies a two-second dependency timeout and controlled `503`; the dead-host runtime simulation could not be executed under the local command policy.

## Findings

| Severity | Finding / location                                                                                                                            | Status          | Required action                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| HIGH     | Large uncommitted release candidate on the audit branch                                                                                       | NEEDS MY ACTION | Review the full diff, especially deleted original assets and API/config changes, then approve a scoped commit and push.                      |
| HIGH     | 13 new migrations (`202607181100` through `202607181390`) have unknown remote status                                                          | NEEDS MY ACTION | Link the intended Supabase project, compare migration history, take a verified backup, dry-run, then apply only after review.                |
| HIGH     | Vercel project link, production env names, deployment commit, and runtime logs are unverified                                                 | NEEDS MY ACTION | Authenticate/link Vercel and complete the checklist below before production deployment.                                                      |
| MEDIUM   | Remote Supabase Auth rate limits, email verification, password recovery, storage policies, and deployed RLS cannot be proven from local files | NEEDS MY ACTION | Verify these controls in the intended Supabase dashboard/project.                                                                            |
| MEDIUM   | Hero video is 4.69 MB and deliberately loaded as the primary visual                                                                           | ACCEPTED RISK   | Current Lighthouse is strong; retain as a design tradeoff or produce a visually approved smaller encode later.                               |
| LOW      | Next.js reports the `middleware` convention as deprecated                                                                                     | NEEDS MY ACTION | Migrate to the Next.js `proxy` convention in a separate tested change. It is not a current build failure.                                    |
| LOW      | Fresh install reports deprecated transitive packages (`whatwg-encoding`, `node-domexception`, `glob@9`)                                       | ACCEPTED RISK   | Reassess through routine dependency updates; `npm audit` currently reports zero vulnerabilities.                                             |
| LOW      | Latest major dependency versions are available                                                                                                | ACCEPTED RISK   | Upgrade in isolated batches with regression testing; no security-driven major update is required now.                                        |
| MEDIUM   | CSP was report-only                                                                                                                           | FIXED           | Enforced CSP plus frame, MIME, referrer, HSTS, and permissions policies are configured in `next.config.ts`.                                  |
| MEDIUM   | Repeatable pre-deploy verification was incomplete                                                                                             | FIXED           | Added `validation-agent/`, machine-readable checklist, secret/history scanner, Lighthouse/load checks, and `.github/workflows/validate.yml`. |
| LOW      | Manifest and explicit Node runtime contract were missing                                                                                      | FIXED           | Added `/manifest.webmanifest`, `.nvmrc`, and package engine bounds.                                                                          |
| MEDIUM   | Hero page fade and oversized logo transfer delayed LCP                                                                                        | FIXED           | Removed the page opacity delay and supplied responsive image sizes. Final mobile Lighthouse rose from 68 to 95.                              |
| LOW      | CSP `upgrade-insecure-requests` broke local HTTP WebKit validation                                                                            | FIXED           | Removed the redundant directive; HSTS and substantive CSP restrictions remain, and 14/14 production Safari checks pass.                      |

No exposed service-role credential, raw SQL concatenation, unsafe `eval`, wildcard credentialed CORS, unsanitized HTML injection, or operational table without a local RLS enable statement was found. The service-role client is marked server-only. JSON-LD output escapes `<`.

## Three-Way Sync

| Concern               | GitHub                                                                              | Vercel                                          | Supabase                                   | State       |
| --------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------ | ----------- |
| Committed code        | Local HEAD equals `origin/main` at `68bbfbc`, but candidate changes are uncommitted | Deployment commit unknown                       | N/A                                        | OUT OF SYNC |
| Environment variables | `.env.example` documents 30 names; secret env files are ignored                     | Production/development/preview names unverified | Project URL/key correspondence unverified  | OUT OF SYNC |
| Schema/migrations     | 20 local files, including 13 new candidates                                         | Build consumes runtime schema contract          | Remote migration history unverified        | OUT OF SYNC |
| CI/release state      | Local CI and validation workflows pass locally                                      | Latest deployment/logs unverified               | Remote health and RLS verification pending | OUT OF SYNC |

`gh` is installed but not authenticated. Vercel and Supabase CLIs are not globally installed or linked, so remote evidence was not fabricated or inferred.

## Performance Results

### Lighthouse

| Profile | Performance before | Performance after | Accessibility | Best Practices | SEO |
| ------- | -----------------: | ----------------: | ------------: | -------------: | --: |
| Mobile  |                 68 |            **95** |            96 |            100 |  92 |
| Desktop |                 80 |            **80** |            96 |            100 |  92 |

Desktop performance varied from 80 to 100 across final production runs because the hero video is the LCP candidate; 80 is recorded as the conservative release baseline.

### 30-Second Sustained Stress Tests

All 27 endpoint/concurrency runs completed with zero HTTP errors and zero timeouts. At 200 connections the server saturated gracefully: throughput remained stable while latency increased.

| Endpoint      |   Connections |       Requests/sec |        p50 ms | p95 upper bound ms |         p99 ms | Error rate |
| ------------- | ------------: | -----------------: | ------------: | -----------------: | -------------: | ---------: |
| `/home`       | 10 / 50 / 200 |    510 / 715 / 702 | 14 / 68 / 282 |      39 / 92 / 328 | 45 / 100 / 332 |         0% |
| `/treatments` | 10 / 50 / 200 |    661 / 648 / 629 | 13 / 75 / 315 |      24 / 98 / 361 | 29 / 104 / 369 |         0% |
| `/api/health` | 10 / 50 / 200 | 1453 / 1455 / 1449 |  4 / 31 / 159 |      25 / 83 / 294 | 30 / 107 / 317 |         0% |

The final short smoke reached 320 req/s on `/home`, 296 req/s on `/treatments`, and 677 req/s on `/api/health`, again with zero errors. Client chunks total 1.07 MB raw / 317.5 KB gzip across 23 chunks; no individual chunk exceeds 70 KB gzip.

## Manual Release Checklist

1. Review the entire dirty diff and specifically approve deleted source assets, API route removal, all EMR permission changes, and all 13 new migration candidates.
2. Authenticate GitHub and inspect remote CI: `gh auth login`, then `gh run list --branch audit/production-readiness-20260718` after push.
3. Link Supabase to the intended production project and compare `supabase migration list`. Verify Auth rate limits, email verification/recovery, storage bucket policies, RLS policies, and branch/MFA behavior in that project.
4. Create and verify a database backup before any migration. Run the migration verification SQL after applying each approved group. Never reset or overwrite production data.
5. Link Vercel and compare environment variable **names** for development, preview, and production against `.env.example`. Never print secret values into logs.
6. Deploy a preview first. Exercise login/logout, booking, staff navigation, patient registration/contact reveal, appointment state changes, image/video loading, responsive layouts, and Supabase writes using non-production test records.
7. Promote only after preview checks, remote CI, migration verification, Vercel logs, and production health/readiness all pass.

## Deployment Commands (Run Only After Approval)

```powershell
# 1. Commit and push the reviewed release candidate
git switch audit/production-readiness-20260718
git add --all
git diff --cached --check
npm run validate
git commit -m "Harden ESCLARE production readiness"
git push -u origin audit/production-readiness-20260718

# 2. Link and safely verify Supabase before applying migrations
npx supabase@latest login
npx supabase@latest link --project-ref <PRODUCTION_PROJECT_REF>
npx supabase@latest migration list
npx supabase@latest db dump --linked --file "backups/pre-deploy-20260719.sql"
npx supabase@latest db push --dry-run
# Review the dry run and backup, then explicitly approve before:
npx supabase@latest db push

# 3. Link Vercel, verify environment names, deploy preview, then production
npx vercel@latest login
npx vercel@latest link
npx vercel@latest env ls
npx vercel@latest
# Verify preview and logs, then explicitly approve before:
npx vercel@latest --prod
```

If Hostinger is the final host instead of Vercel, do not run the final Vercel command. Configure Node 22, the documented production environment names, HTTPS/security headers, process supervision, and health checks in Hostinger, then repeat the production smoke and Supabase connectivity verification against the Hostinger URL.
