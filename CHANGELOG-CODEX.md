# Codex Changelog

## 2026-07-19 - Master Command v2.1 Discovery Start

Files added:

- `docs/master-command-v2-discovery-2026-07-19.md`
- `THREAT-MODEL.md`
- `DECISIONS.md`
- `RISKS.md`

Evidence recorded:

- Read the attached ESCLARE Master Codex Command v2.1 security-centered brief.
- Confirmed local source is a Next.js App Router app using Next.js 16.2.10.
- Confirmed `.env.example` exists and `.env.local` is absent.
- Confirmed no `.github` workflow directory was present in this workspace snapshot.
- Confirmed current branch is `audit/production-readiness-20260718`.
- Confirmed dependency audit result: `npm.cmd audit --audit-level=high` returned `found 0 vulnerabilities`.

No functional application behavior was changed in this entry.

## 2026-07-19 - Repository Security Baseline

Files added:

- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/dependabot.yml`
- `.github/CODEOWNERS`
- `INCIDENT-RESPONSE.md`

Controls added:

- Pull-request and `main` CI for locked install, format, lint, type-check, unit tests, dependency audit, and production build.
- Full-history Gitleaks scanning with the Action pinned to an exact commit SHA.
- CodeQL analysis for JavaScript and TypeScript with the Action pinned to an exact commit SHA.
- Weekly npm and GitHub Actions dependency update checks.
- Default repository ownership assigned to `@Singleancestry`.
- Incident severity, evidence preservation, containment, notification-decision, and kill-switch procedures.

The GitHub workflows have been added locally only. Remote branch protection, workflow execution, CodeQL results, and secret-scan results remain unverified until the branch is pushed and reviewed through a pull request.

Local verification evidence:

- `npm.cmd run format:check`: passed; all matched files use Prettier formatting.
- `npm.cmd run lint`: passed.
- `npm.cmd run typecheck`: passed.
- `npm.cmd test`: passed with 14 test files and 63 tests.
- `npm.cmd run build`: passed and generated 42 App Router routes; the tracked middleware deprecation warning remains.
- `npm.cmd audit --audit-level=high`: passed with 0 vulnerabilities.
- The CI, CodeQL, and Dependabot files parsed successfully as YAML.

## 2026-07-19 - Security Headers And Environment Contract

Files added:

- `scripts/check-environment-contract.mjs`
- `docs/environment-matrix-2026-07-19.md`

Files updated:

- `next.config.ts`
- `package.json`
- `.github/workflows/ci.yml`
- `tests/unit/operational-controls.test.ts`

Controls added:

- Report-only Content Security Policy for production observation before enforcement.
- HSTS, cross-origin resource policy, DNS prefetch, and cross-domain policy headers.
- Repository-side environment contract validation that rejects secret-like `NEXT_PUBLIC_` variable names, missing required names, duplicate names, and missing local-env ignore rules.
- Dev/staging/production environment separation and variable-classification documentation.

Verification evidence:

- `npm.cmd run env:check`: passed with 30 documented variable names.
- `npm.cmd run format:check`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run typecheck`: passed.
- `npm.cmd test`: passed with 14 test files and 65 tests.
- `npm.cmd run build`: passed with 42 App Router routes; the tracked middleware deprecation warning remains.
- Production-mode `GET /home`: returned HTTP 200 with HSTS, CSP report-only, cross-origin resource policy, and referrer policy headers present.

## 2026-07-19 - Public Website Content And Design Enhancement

Added a transparent, high-resolution ESCLARE wordmark, a larger responsive public navigation, and a first-class Skin Education entry point.

Added 14 structured education drafts across laser treatments, weight management, skin concerns, and MCCM skin science. Every draft includes SEO metadata, references, practical sections, FAQs, related content, and an explicit medical-review-required state. Draft articles are previewable in development but excluded from production pages, structured data, and the sitemap until approved.

Added individual treatment guides for every public catalog treatment with suitability, timing, consultation requirements, beforecare, aftercare, recovery expectations, FAQs, and appointment links. Added dynamic treatment and education category entries to the sitemap.

New primary files:

- `lib/content/skin-education.ts`
- `components/public/education-article-card.tsx`
- `components/public/skin-education-explorer.tsx`
- `app/(public)/skin-education/`
- `lib/services/details.ts`
- `app/(public)/treatments/[slug]/page.tsx`
- `public/images/optimized/logo/esclare-official-wordmark-transparent-v2.png`

Verification evidence:

- `npm.cmd run env:check`: passed with 30 documented variable names.
- `npm.cmd run format:check`: passed.
- `npm.cmd run lint`: passed with no warnings.
- `npm.cmd run typecheck`: passed.
- `npm.cmd test`: passed with 15 test files and 70 tests.
- `npm.cmd run build`: passed; the tracked middleware deprecation warning remains.
- Desktop review at 1440 x 900 and mobile review at 390 x 844 passed for navigation, logo, education search, article layout, treatment layout, and footer behavior.
- Production-mode `/skin-education` returned 200 with the clinical-review state and no draft titles; a direct draft URL returned 404 with no draft article payload.

## 2026-07-19 - Hero Media Balance Refinement

Compressed the existing hero's horizontal ivory wash so desktop media is fully revealed from approximately 46% of the viewport instead of fading across the full width. Added proportional tablet and mobile gradient stops while preserving the hero markup, text position, media object position, video behavior, and reduced-motion behavior.

Responsive visual checks passed at 1440 x 900, 768 x 1024, and 390 x 844 with no hard gradient edge or overlapping interface controls.

## 2026-07-19 - Final Hero Video and Typography Revision

Processed the user-supplied 1280 x 720, 24 fps, 10.01-second H.264 hero master with a shape-aware reconstruction limited to the Gemini watermark region. The sequence, duration, frame rate, framing, color treatment, intended gold particles, and source audio stream were preserved. The final video autoplays muted and inline once, remains mounted on its final frame, pauses outside the viewport or in inactive tabs, and falls back to an optimized opening-frame poster. Reduced-motion visitors receive the static poster without a video request.

Removed the hero gradient wash from the DOM and responsive CSS so the video remains fully visible. Added a restrained metallic maroon embossed treatment to the existing hero headline through highlight and depth shadows only; no font metrics, content, position, animation, navigation typography, buttons, trust points, or downstream sections were changed.

The supplied JPEG remains a visual reference only and is not rendered by the website. Existing navigation labels and destinations, responsive header behavior, hero copy, CTAs, and all live HTML controls remain intact.

Final assets:

- `public/media/esclare-hero-final-no-logo-v3.mp4`
- `public/images/optimized/clinic/esclare-hero-final-poster-v3.webp`

Verification evidence:

- Prettier formatting, ESLint, and strict TypeScript checks passed.
- All 15 unit test files and 70 tests passed, including six focused one-shot hero playback tests.
- The production build passed and generated 75 static/dynamic route entries; the tracked Next.js middleware deprecation warning remains.
- All 35 focused public-media flows passed in desktop Chromium, Firefox, WebKit, mobile Chrome, and mobile Safari.
- Live responsive reviews passed at 1440 x 900, 768 x 1024, and 390 x 844 without horizontal overflow, missing controls, or a hero wash element.
- Live playback reached 10.005 seconds with `loop: false`, entered the `complete` state, remained paused on the final visible frame, and showed no black frame or watermark in the reviewed composition.
