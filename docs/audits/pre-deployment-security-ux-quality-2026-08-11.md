# ESCLARE pre-deployment security, UX, and quality audit

Audit completed: 2026-08-11 13:27 PHT

## Decision

All blocking local checks passed. The approved website changes are eligible for deployment to the existing Hostinger production application after the exact commit is pushed to GitHub `main` and Hostinger completes its connected build.

## Security and privacy

- Secret scanning passed for the working tree and complete Git history.
- The ignored local Vercel OIDC token is expired and is not used by the Hostinger workflow.
- `npm audit` reports zero vulnerabilities across production and development dependencies.
- Supabase service-role access remains server-only. Website-only middleware continues to block staff, authentication, patient, finance, clinical, audit, and related API surfaces in production.
- Permission, MFA, branch-isolation, PHI-reveal, and RLS migration tests passed.
- Public form inputs remain server-validated. Booking persistence remains disabled in website-only production; the form prepares a branch contact request without writing patient data.
- Analytics and Meta Pixel are absent before explicit consent. Visitors can reject, customize, save, and reopen their choices. Analytics events exclude entered names and contact information.
- Security headers remain configured, including HSTS, CSP, frame denial, MIME sniffing protection, referrer policy, and permissions policy.
- No public upload workflow is present.

## Content regression

- Fifteen approved treatment families were added without changing any pre-existing treatment fields.
- No existing treatment, price, package, branch, diode, MCCM, review, logo, or navigation record was removed.
- Rejuran content remains absent.
- Stale Rejuran compatibility aliases were removed; all six legacy and destination paths return 404.
- Regulatory-review services remain non-bookable and excluded from the public sitemap.
- The additive Supabase catalog migration contains inserts only. It is not required by the static Hostinger public catalog and was not applied during this website deployment.

## Automated evidence

- Full validator: 13 of 13 checks passed.
- Unit and security tests: 134 of 134 passed across 25 files.
- Production build: passed; 118 pages generated.
- Production public browser tests: 317 of 320 passed on the first five-browser run; the three browser-specific cases were corrected and their WebKit/iPhone reruns passed. Chromium's complete production-public suite passed 64 of 64 applicable tests.
- Accessibility: 30 axe route/viewport checks passed with no violations.
- Responsive QA: Android, iPhone, tablet, laptop, and desktop profiles passed with no horizontal overflow.
- Load smoke: zero errors; p95 latency was approximately 12 ms for the legacy-home redirect, 27 ms for treatments, and 11 ms for health.
- Final Lighthouse rerun: canonical homepage and treatments both scored 96 mobile / 100 desktop performance. Accessibility, best practices, and SEO were 100 for both pages and both profiles.

## Hostinger workflow and rollback

- Hostinger is connected to `https://github.com/Singleancestry/esclare-emr` and deploys pushes to `main` as a Next.js application on Node.js 22.
- Hostinger environment variables were inspected by name only; their values remained masked and unchanged.
- The current stable production deployment is commit `143b2c627d74fc74ea12a61fe5d29e4e11d6f0f0`.
- Rollback method: redeploy that completed Hostinger deployment from the deployment history if post-deployment smoke tests fail.
- DNS, SSL, email, redirects, environment variables, and unrelated Hostinger files are outside this Git-connected deployment and must remain unchanged.
