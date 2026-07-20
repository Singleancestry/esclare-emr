# ESCLARE Architecture Decisions

## ADR-001 - Discovery Before Functional Changes

Date: 2026-07-19

Context: The attached Master Command v2.1 requires discovery before functional changes and applies heightened privacy/security expectations for a medical-adjacent production system.

Options:

- Continue building features immediately.
- First produce a current-state report, threat model, risk register, and changelog.

Decision: Produce governance and discovery artifacts before functional code changes.

Consequences:

- Slower visible feature progress in the first pass.
- Lower risk of enabling incomplete EMR, booking, export, or marketing features prematurely.
- Creates evidence trails required for later GitHub/Hostinger/Supabase deployment decisions.

## ADR-002 - Keep EMR And Growth Features Off Until Supabase Verification

Date: 2026-07-19

Context: Local source includes controlled staff surfaces and many hardening migrations, but live Supabase, storage, RLS, MFA, backup/restore, and integration settings are not available in this workspace.

Options:

- Enable EMR/growth features from source confidence alone.
- Keep them off or pilot-only until staging verification proves access controls and data integrity.

Decision: Keep EMR, exports, patient portal, Google integrations, marketing campaigns, referrals, and production booking persistence off/pilot until staging verification is complete.

Consequences:

- Public website can progress toward hosting.
- Patient data risk is reduced.
- Full production readiness remains blocked until environment and database gates pass.

## ADR-003 - Hostinger Requires A Node/Standalone Deployment Path

Date: 2026-07-19

Context: The user is planning Hostinger hosting. The app is a dynamic Next.js/Supabase app, not a static-only site.

Options:

- Export static HTML only.
- Use Next.js standalone Node deployment.

Decision: Treat Hostinger deployment as a Node.js Next.js deployment using `npm run build`, `npm run start`, and `output: "standalone"`.

Consequences:

- Hostinger plan must support Node.js apps.
- Production env vars must be configured in Hostinger.
- Supabase remains the source of truth for dynamic features.

## ADR-004 - Pin Third-Party GitHub Actions By Commit SHA

Date: 2026-07-19

Context: The master command requires supply-chain controls and explicitly calls for GitHub Actions to be pinned by SHA.

Decision: Pin checkout, Node setup, CodeQL, and Gitleaks Actions to exact commit SHAs and let Dependabot propose reviewed updates.

Consequences:

- Workflow dependencies cannot move silently when a mutable version tag changes.
- Action updates require review and a new pinned SHA.
- Remote workflow execution still needs verification after a pull request is opened.

## ADR-005 - Defer Middleware-To-Proxy Migration For OpenNext Compatibility

Date: 2026-07-19

Context: Next.js 16 deprecates `middleware.ts` in favor of Node-runtime `proxy.ts`. The repository also has an OpenNext/Cloudflare Sites build path, whose current documentation says Node middleware is not yet supported.

Options:

- Rename to `proxy.ts` immediately and risk breaking the existing preview build.
- Keep the working middleware temporarily and migrate after the final hosting target or adapter support is confirmed.

Decision: Keep `middleware.ts` for this phase. Re-evaluate after Hostinger/Vercel is selected as the production target or OpenNext confirms Node proxy support.

Consequences:

- The standard Next.js build retains a deprecation warning.
- Existing Supabase cookie refresh and OpenNext preview compatibility are preserved.
- This warning remains tracked as non-blocking technical debt.

## ADR-006 - Observe CSP Before Enforcement

Date: 2026-07-19

Context: A strict enforced CSP without production violation evidence can break Next.js scripts, media, Supabase requests, or approved external booking/contact links.

Decision: Deploy the proposed policy as `Content-Security-Policy-Report-Only` first. Review violations in staging and production monitoring, remove unnecessary allowances, then move to nonce-based enforcement in a reviewed release.

Consequences:

- Browsers can report policy violations without blocking the current website.
- CSP is not yet an enforcement boundary and remains a tracked hardening step.
- HSTS and the other deterministic security headers are enforced immediately.

## ADR-007 - Gate Medical Education Until Named Clinical Review

Date: 2026-07-19

Context: the requested Skin Education library includes prescription medicines, energy-based treatments, contraindications, adverse effects, and aftercare. Source research improves accuracy but does not replace review by an ESCLARE-qualified clinician.

Decision: keep all new articles as development-only drafts with `medical-review-required` status and no reviewer attribution. Exclude them from production lists, direct production rendering, structured data, and the sitemap until an approved reviewer and publication decision are recorded.

Consequences:

- The full content and design can be reviewed locally without making unsupported public medical claims.
- Production users see a controlled clinical-review state instead of draft articles.
- Publishing requires an intentional content change and reviewed release.
