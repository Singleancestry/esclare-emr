# ESCLARE Owner Review: Pending Work Started

Date: 2026-08-02  
Branch: `codex/treatments-skin-support-preview-20260729`  
Status: Local preview only; production deployment is not approved or performed.

## Completed in this pass

- Established `/` as the single canonical homepage and retained `/home` as a permanent redirect.
- Added one local-search H1 for the homepage while preserving the visual hero headline.
- Updated sitemap, canonical links, internal homepage links, manifest, breadcrumbs, and public metadata.
- Added the Google tag `G-RS34GQW8W6` once at the application root.
- Added privacy-safe booking, branch, phone, directions, and treatment analytics events.
- Updated the analytics Content Security Policy destinations.
- Added SEO audit, measurement, and Google Business Profile guidance documents.
- Added EMR role/permission, domain model, privacy/retention, and reference-gap documents.
- Added a permission-gated immutable Activity section to patient profiles.
- Preserved existing RLS policies and database SQL without modification.
- Converted route-level structured data to the shared Next.js-managed JSON-LD component.
- Added Cloudflare Turnstile verification to staff login, password recovery, and public appointment requests.
- Passed Turnstile tokens through to Supabase Auth for login and password recovery.
- Updated the Content Security Policy for the Turnstile challenge origin.
- Reduced the live Supabase sign-up/sign-in limit from 30 to 10 requests per five minutes.

## Validation completed

- TypeScript: passed.
- ESLint: passed.
- Unit tests: 101 passed.
- Targeted Playwright tests: 28 passed.
- Public accessibility tests: 27 passed across mobile, tablet, and desktop.
- Production build: passed; 87 routes generated.
- Dependency audit: zero vulnerabilities.
- Git diff whitespace check: passed.
- Security/auth/booking Playwright subset: 16 passed after the Turnstile integration.

## Live Supabase security review

- Project reviewed: `ESCLARE EMR Preview` (`icvnhounuuomdmuhyyeu`).
- TOTP MFA is enabled and phone MFA is disabled.
- AAL1 session duration limiting is enabled.
- Compromised refresh-token detection is enabled with a 10-second reuse interval.
- CAPTCHA protection is currently disabled in Supabase Auth. Enable it only after the Cloudflare Turnstile site and secret keys are installed in every target environment.
- Advanced single-session, inactivity timeout, and absolute session-duration controls are unavailable on the current Free plan.
- Scheduled database backups are unavailable on the current Free plan.
- Supabase Storage currently has no buckets; private clinical-image storage is therefore not configured.

## Still pending

- Owner review of the local website and staff preview.
- Remaining Phase 21 EMR modules, implemented incrementally behind the approved permission model.
- Supabase schema or migration work, only after a backup and explicit owner approval.
- Live Supabase authentication and staff-profile verification with production-safe credentials.
- Google Search Console and Google Business Profile dashboard actions requiring account access.
- Git commit/push and a Vercel preview deployment after the current mixed working tree is reviewed.
- Hostinger or production deployment only after explicit approval of the preview.
- Production smoke testing and post-deployment analytics verification.
- Cloudflare Turnstile site creation and installation of `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in staging and production.
- Enabling Supabase CAPTCHA after those Turnstile credentials are present.
- Upgrading or otherwise providing encrypted database and storage backups, followed by a documented restoration test.
- Creating a private clinical-media bucket only with approved storage RLS policies and short-lived signed-URL access.
- Configuring a privacy-filtered monitoring provider and security alert recipients.
- Testing privileged-role MFA flags and real cross-branch/cross-patient RLS denial with controlled test identities.

## Credential rotation gate

Supabase service-role, Vercel, and Hostinger credentials were not rotated in this pass. Rotation is intentionally blocked until all of the following are true:

1. A recoverable database and storage backup exists and a restoration procedure is available.
2. The Vercel and Hostinger environment-variable destinations are authenticated and identified.
3. The new Supabase key can be installed atomically in every server environment without exposing it to the browser.
4. A staging smoke test confirms authentication, booking persistence, and staff-profile assignment before the old credentials are revoked.

Rotating first would risk breaking the live website and EMR while leaving no verified rollback path.

## Security gates retained

- Do not widen RLS policies to make a query pass.
- Do not expose service-role or other server-only secrets to the browser.
- Do not edit production SQL or data without an approved migration and backup.
- Do not permanently delete patient, clinical, finance, or audit records.
- Do not send patient medical data or authentication data to Google Analytics or Sheets.

## Owner decision required

Review the local preview and approve one of these next scopes:

1. Commit the reviewed local changes and create a non-production preview deployment.
2. Continue the next EMR module locally before creating a deployment preview.
3. Separate the accumulated website and EMR changes into smaller reviewable commits first.
