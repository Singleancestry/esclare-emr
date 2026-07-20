# ESCLARE Risk Register

## Critical

### RISK-001 - Production Supabase Security Not Verified

Impact: C3/C4 patient data could be exposed if RLS, storage policies, auth settings, or grants differ from source expectations.

Evidence: No local `.env.local`; no Supabase project credentials available in this pass.

Required action: Verify staging first with anon/auth/service contexts, run migration verification SQL, test storage policies, and document denials.

Production blocking: yes for EMR, portal, booking persistence, exports, and clinical photos.

### RISK-002 - Environment Segregation Not Proven

Impact: Preview/live hosting could point to production data or expose server-only secrets.

Evidence: Only `.env.example` is present locally; Hostinger/Vercel envs were not inspected.

Required action: Create and verify dev/staging/production env matrix without printing values.

Production blocking: yes for anything handling patient data.

## High

### RISK-003 - No CI Workflow Observed

Impact: GitHub may accept changes without lint, typecheck, unit, build, audit, or secret scanning gates.

Evidence: `.github` directory was not present in the workspace inventory.

Required action: Push the new CI, CodeQL, Gitleaks, Dependabot, and CODEOWNERS configuration through a pull request; require passing checks and reviews in branch protection.

Production blocking: yes for a disciplined production release.

Status: locally remediated, remotely unverified.

### RISK-004 - EMR Modules Remain Controlled/Incomplete

Impact: Clinical notes, consents, photos, package ledgers, finance, inventory, and exports cannot be safely operated as a complete EMR.

Evidence: protected placeholders and existing docs state incomplete clinical/payment/inventory/reporting phases.

Required action: keep flags off/pilot and implement modules only after database security gates pass.

Production blocking: yes for EMR.

### RISK-005 - Google Integrations Not Verified

Impact: Calendar/Drive/Gmail sync may fail, leak excess data, or use overbroad OAuth scopes.

Evidence: no live OAuth credentials/scopes/token storage or test event/export evidence available in this pass.

Required action: implement staging OAuth verification, encrypted token storage tests, minimized event/export payloads, and webhook signature tests.

Production blocking: yes for integration claims.

## Medium

### RISK-006 - Next.js Middleware Convention Deprecated

Impact: future Next.js upgrades may require migration to `proxy` convention.

Evidence: `next build` warns that `middleware` file convention is deprecated.

Required action: migrate `middleware.ts` to the supported proxy convention after confirming Supabase cookie-refresh compatibility.

Production blocking: no today.

Accepted temporarily: OpenNext/Cloudflare currently documents Node middleware as unsupported, so an immediate rename could break the existing Sites preview path.

### RISK-007 - Demo/Placeholder Language Remains In Staff/UI Source

Impact: staff users may confuse demo metrics or incomplete surfaces with real production functionality if flags are loosened.

Evidence: `rg` found demo/placeholder references in dashboard docs/source and protected placeholder modules.

Required action: remove or clearly guard demo metrics before staff pilot.

Production blocking: yes for staff/EMR pilot polish, no for public website-only launch.

### RISK-008 - Content Security Policy Is Report-Only

Impact: CSP violations are observable but not blocked, so CSP does not yet mitigate an injected script in production.

Evidence: `next.config.ts` emits `Content-Security-Policy-Report-Only` while compatibility data is gathered.

Required action: collect violation evidence in staging, adopt nonce-based Next.js scripts, remove unnecessary allowances, and enforce the validated policy.

Production blocking: no for limited website preview; yes before a high-assurance EMR launch.

### RISK-009 - Skin Education Articles Await Clinical Approval

Impact: publishing treatment, medicine, contraindication, or aftercare guidance without a named qualified reviewer could create clinical and reputational risk.

Evidence: all 14 articles are marked `medical-review-required`, have no reviewer attribution, and are excluded from production visibility, structured data, and the sitemap.

Required action: an ESCLARE-qualified clinician must review each article, approve the exact content and references, add reviewer identity and review date, then change its editorial status and publication flag through a reviewed release.

Production blocking: yes for publishing these articles; no for the existing public website or treatment-guide navigation.
