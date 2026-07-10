# Architecture

## Goal

Build a secure multi-branch clinic-management platform for ESCLARE Aesthetic & Wellness Clinic. Phase 1 establishes the foundation: project structure, design system, authentication boundaries, employee profiles, roles, permissions, branch restrictions, core database objects, main staff layout and dashboard shell.

## Application Layers

- `app/(public)` contains the public ESCLARE website shell.
- `app/(auth)` contains login, lock-screen and auth callback screens.
- `app/(staff)` contains authenticated staff experiences.
- `components/layout` contains navigation, sidebar, top bar and shell primitives.
- `components/dashboard` contains role-aware dashboard cards and chart placeholders.
- `components/security` contains permission and audit-facing UI.
- `lib/auth` wraps Supabase session handling.
- `lib/permissions` owns roles, permissions, route guards and menu filtering.
- `lib/database` owns typed Supabase clients and database DTOs.
- `lib/audit` owns immutable audit-event helpers.
- `lib/validation` owns Zod schemas.

## Runtime Model

Supabase Auth is the identity provider. Application employees are stored in `employees` and linked to `auth.users` through `auth_user_id`. Role assignment is stored per branch in `employee_branch_roles`, which lets an employee have different access by branch.

The browser uses the Supabase anon key. Server-only tasks use the service-role key only inside server-only modules and route handlers.

## Phase 1 Screens

- Public home page with ESCLARE brand positioning.
- Login screen.
- Staff dashboard shell with sidebar, branch selector, global patient search, notification action, employee badge, role badge and lock action.
- Owner, reception, provider, doctor and cashier dashboard sections populated by seeded development data placeholders.

## Future Phase Boundaries

Patient workflows begin in Phase 2. Treatment catalog and Google Sheets staging begin in Phase 3. Appointments, clinical encounters, POS, inventory, finance, public booking and hardening continue in later phases.
