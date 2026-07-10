# Vercel Deployment

1. Import the repository into Vercel.
2. Configure production environment variables from `.env.example`.
3. Store Supabase service-role and Google service-account credentials as encrypted server-only variables.
4. Set the production Supabase URL and anon key.
5. Run migrations before routing real users to production.
6. Verify RLS policies in production.
7. Run `npm run build`, `npm run lint`, `npm run typecheck` and `npm run test` in CI.
