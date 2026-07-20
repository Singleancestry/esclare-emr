# ESCLARE Environment Matrix

Date: 2026-07-19

This document records variable names and handling rules only. Never add live values, tokens, credentials, project references, or private keys to this file.

## Environment Separation

| Environment     | Application              | Supabase                                          | Data                       | Allowed integrations                       |
| --------------- | ------------------------ | ------------------------------------------------- | -------------------------- | ------------------------------------------ |
| Development     | Local Next.js server     | Development project or intentionally unconfigured | Synthetic only             | Mock/sandbox only                          |
| Staging/preview | Preview deployment       | Dedicated staging project                         | Synthetic, production-like | Test Google account/calendars/folders only |
| Production      | Approved production host | Production project                                | Real clinic data           | Clinic-owned production accounts only      |

A preview deployment connected to production Supabase is a release-blocking security finding. Production credentials must never be copied into development or preview settings.

## Variable Classification

| Variable                                | Scope              | Required when                    | Notes                                                              |
| --------------------------------------- | ------------------ | -------------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`                   | Public             | All deployed environments        | Canonical application origin; contains no credential               |
| `NEXT_PUBLIC_SITE_URL`                  | Public             | Public website deployment        | Public site origin used by metadata, robots, and sitemap           |
| `NEXT_PUBLIC_SUPABASE_URL`              | Public             | Supabase-backed features         | Project API URL; environment-specific                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`         | Public             | Supabase Auth/client access      | Supabase anon/publishable key only; RLS must treat it as untrusted |
| `SUPABASE_SERVICE_ROLE_KEY`             | Server secret      | Server-side privileged workflows | Never browser-exposed; production host secret storage only         |
| `APPOINTMENT_REQUEST_RATE_LIMIT_SECRET` | Server secret      | Public booking persistence       | Random, environment-specific, and independently rotated            |
| `HEALTH_CHECK_TOKEN`                    | Server secret      | Protected readiness monitoring   | Supplied only by the authorized monitor                            |
| `FEATURE_PILOT_STAFF_IDS`               | Server operational | Production pilot mode            | Staff identifiers; not a browser authorization control             |
| `ENABLE_*`                              | Server operational | Feature rollout                  | Defaults remain off/pilot until the corresponding gate passes      |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`          | Server restricted  | Approved Google integration      | Clinic-owned integration identity only                             |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`    | Server secret      | Approved Google integration      | Never logged, exported, or committed                               |
| `GOOGLE_SHEETS_CATALOG_ID`              | Server restricted  | Approved Sheets integration      | Staging and production destinations must differ                    |

## Deployment Gate

For each environment, verify without printing values:

1. Every required variable exists in the intended host scope.
2. No variable containing `SECRET`, `PRIVATE`, `SERVICE_ROLE`, `PASSWORD`, or `TOKEN` uses the `NEXT_PUBLIC_` prefix.
3. Preview and production Supabase project URLs identify different projects.
4. Development and staging use synthetic data and sandboxed notification/integration destinations.
5. Feature flags for unverified EMR, export, clinical photo, marketing, and integration modules remain off or approved pilot-only.
6. The protected readiness endpoint returns success only after the expected database release marker is present.
7. Rotating one environment's secret does not affect another environment.

`npm run env:check` validates the repository-side variable-name contract. It does not inspect hosting-provider values and does not prove environment separation by itself.
