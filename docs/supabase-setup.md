# Supabase Setup

1. Create a Supabase project.
2. Enable email verification.
3. Configure strong password requirements.
4. Enable MFA for privileged staff accounts.
5. Apply `database/migrations/202607100900_core_security.sql`.
6. Apply `database/migrations/202607100910_rls_policies.sql`.
7. Apply `database/seeds/001_roles_permissions.sql`.
8. Apply `database/seeds/002_demo_phase1.sql`.
9. Add public anon credentials to `.env.local`.
10. Add the service-role key only to server-side deployment environment variables.

Never expose the service-role key in client components, browser bundles or public logs.
