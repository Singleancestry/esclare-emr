# ESCLARE Clinic Platform

Phase 1 foundation for the ESCLARE Aesthetic & Wellness Clinic management platform.

## Included In Phase 1

- Next.js App Router with TypeScript strict mode.
- Tailwind-based ESCLARE design foundation.
- Public home page, staff login, lock screen and protected staff shell.
- Owner, receptionist, cashier, aesthetician/provider and doctor dashboard shells.
- Supabase environment setup.
- Branch-aware auth, role and permission helpers.
- Migrations for branches, app users, employee profiles, roles, permissions, branch role assignments, trusted devices, rooms, devices and immutable audit events.
- RLS helper functions and policies.
- Fictional seed data for Naga and Daet.
- Unit and Playwright test scaffolding.
- Phase 2 patient directory, registration, profile shell, medical-profile visibility and audit-log surfaces.

## Run Locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in Supabase values before testing real authentication.

## Verify

```bash
npm run lint
npm run typecheck
npm run test
npm run e2e
```

Patient clinical encounters and treatment records are intentionally not implemented yet.
