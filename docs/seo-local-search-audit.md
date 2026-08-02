# ESCLARE SEO and Local Search Audit

Date: 2026-08-02
Status: implementation in progress; production unchanged

## Architecture

| Area | Current implementation |
| --- | --- |
| Framework | Next.js 16.2.11 with React 19.2 and TypeScript strict mode |
| Routing | App Router with public, auth, and staff route groups |
| Data | Supabase PostgreSQL, Auth, Storage-ready services, and RLS migrations |
| Hosting | Vercel-compatible Next build; Hostinger deployment is separately configured |
| Public content | Server-rendered pages backed by TypeScript service and education catalogs |
| Booking | Public server action with Zod validation, honeypot, idempotency key, HMAC fingerprint, and optional atomic Supabase RPC |
| Analytics | Google tag `G-RS34GQW8W6` in the shared root head plus privacy-safe public event helper |

## Required Audit Inventory

1. Metadata uses Next.js `Metadata` exports and route-level `generateMetadata`.
2. `app/sitemap.ts` includes public routes and filters regulatory-review treatments.
3. `app/robots.ts` blocks staff, auth, API, and sensitive operational routes.
4. Organization and branch JSON-LD are centralized under `lib/seo`.
5. Treatment JSON-LD exists for publishable treatment detail pages.
6. Treatment and approved price data come from `lib/services/catalog.ts` and related service modules.
7. Branch facts come from `lib/clinic/details.ts`.
8. Booking is handled by `/appointment-request`; a request is not a confirmed appointment.
9. Supabase public credentials are separated from the server-only service-role key.
10. Environment names in use are documented by `.env.example` and the environment contract script.
11. Images use Next Image or explicit media sizing in the public components.
12. A custom not-found page exists; dedicated public error/loading boundaries remain a gap.
13. Most public pages declare canonical URLs.
14. Redirects include legacy treatment routes and conditional `www` host consolidation.
15. Preview deployments are noindexed through metadata, headers, and robots behavior.

## Findings

| ID | Priority | Finding | Required action |
| --- | --- | --- | --- |
| SEO-001 | P0 | `/` redirected to `/home`, leaving the non-preferred homepage as canonical. | Resolved locally: `/` now serves the homepage, `/home` permanently redirects to `/`, and internal links use `/`. |
| SEO-002 | P1 | Sitemap timestamps use the current request time, making every URL appear freshly modified. | Replace runtime timestamps with stable content dates. |
| SEO-003 | P1 | Several priority search intents resolve to anchors or generic treatment entries rather than focused detail pages. | Improve existing equivalent pages first; add a route only when no equivalent exists. |
| SEO-004 | P1 | Google Analytics is installed, but the conversion event vocabulary covers only branch and social interactions. | Add privacy-safe booking, phone, directions, treatment, and form events. |
| SEO-005 | P1 | No cookie-preference component is present. | Obtain an owner/legal decision on analytics consent behavior before production activation. |
| SEO-006 | P1 | Coordinates, postal codes, nearby landmarks, and parking guidance are not verified for both branches. | Keep them absent from schema and content until owner verification. |
| SEO-007 | P1 | Naga and Daet have dedicated branch routes even though the new command prefers one combined branches page. | Keep them only as supporting routes or redirect after owner review; avoid duplicate location copy. |
| SEO-008 | P2 | Public error boundaries and explicit loading states are incomplete. | Add only where real route failure/loading behavior requires them. |
| SEO-009 | P2 | Search Console, Business Profile, and Bing ownership cannot be verified from code. | Complete the dashboard checklist after approved production deployment. |
| SEO-010 | P2 | Draft/review education content needs a consistent `noindex, follow` policy. | Align metadata, sitemap filtering, and status definitions. |

## Business Information Gaps

Do not publish or add to structured data until verified:

- Postal codes and geographic coordinates for each branch.
- Nearby landmarks and parking guidance.
- Special holiday hours.
- Public doctor name, credentials, and review authorization.
- Treatment-specific session intervals or downtime not already approved.
- Any claim that ESCLARE is a dermatology clinic.

## Indexing Decision

Only one homepage should be indexable. Public, approved content may be indexed. Staff, auth, API,
preview, regulatory-review, and unpublished editorial content must remain excluded. Production and
Google dashboards must not be changed until the owner approves the tested preview.
