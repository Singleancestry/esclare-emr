# Production Synchronization Record

Date: 2026-07-20 (Asia/Manila)

## GitHub

- Release commit: `69946e46836763754c064d0b072727a951ba55d6`
- Release branch: `audit/production-readiness-20260718`
- `main` was fast-forwarded to the same reviewed commit.
- Full local validation passed 13/13 checks before publication.

## Vercel

- Project: `esclare-emr-preview`
- Production deployment for commit `69946e4` completed successfully.
- Production alias: `https://esclare-emr-preview.vercel.app`
- The live homepage was verified to contain the updated hero, signature treatments, and Skin Education navigation.
- Security headers remain enabled.

## Supabase

- Linked project: `ESCLARE EMR Preview`.
- Remote history contains seven applied migrations through `202607120010`.
- The applied `202607120001_roles_permissions_seed.sql` migration was recovered into the repository.
- Supabase CLI migration packaging was added under `supabase/migrations` so drift and dry runs are repeatable.
- A dry run found 14 unapplied migrations from `202607121200` through `202607181390`.

## Database Release Gate

The 14 pending migrations were **not applied**. The only linked Supabase project is on the Free Plan,
has no scheduled backups, and no separate staging project was available. The migration risk manifest
requires a recoverable backup and staging rehearsal before production application. Public booking
persistence and unverified EMR modules must remain disabled until those conditions are met.

Required next steps:

1. Create a separate staging Supabase project with synthetic data.
2. Apply and verify all pending migrations there in filename order.
3. Create a recoverable production backup or logical dump.
4. Schedule the reviewed migration window and run every verification SQL file.
5. Enable only the feature flags approved by the controlled production scope.
