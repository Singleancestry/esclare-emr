# Package Policy Migration Plan - 2026-07-29

Migration: `supabase/migrations/202607291200_package_policy_and_refund_foundation.sql`

Status: preview proposal only. It has not been applied to local, preview, or production Supabase.

## Purpose

The proposal adds immutable package-policy versions, branch-scoped patient packages, append-only
acceptance evidence, validity changes, refund requests, append-only refund calculations, and
alternative remedies. It does not enable the feature flag or add a production staff workflow.

## Safety Properties

- No table grants `DELETE` to authenticated staff.
- Policy versions, acceptances, validity changes, calculations, and remedies are append-only for
  authenticated users.
- Operational rows remain branch-scoped through existing permission checks.
- Refund calculations clamp the preliminary value between PHP 0 and the amount actually paid.
- Final approved refund cannot exceed the preliminary value.
- A calculation never issues a refund.
- Service-role access remains server-only and is not introduced to browser code.

## Required Pre-Apply Checks

1. Obtain explicit owner approval after preview review.
2. Complete qualified Philippine legal review of the policy text.
3. Create and verify a restorable production backup without modifying `tmp/`.
4. Test the migration against a disposable Supabase project restored from a recent schema backup.
5. Add integration tests for every RLS policy and negative cross-branch access case.
6. Update generated database types only after the migration is accepted.
7. Build the staff package workflow behind `ENABLE_PACKAGE_BALANCES`; keep it disabled by default.
8. Confirm storage policy for signature evidence before storing any file path.

## Rollback Plan

Because the proposed tables are new and historical consent/refund data must not be destroyed, there
is no automated destructive down migration. If preview testing fails before real data is created,
drop the seven new tables in reverse dependency order in the disposable environment only. If any
real acceptance, package, or refund record exists, disable the feature flag, revoke application
access, preserve the records, and ship a forward-fix migration. Never drop production package,
consent, payment, or audit history.

## Known Gaps

- No patient self-service identity or consent-capture route is implemented.
- No signature storage bucket or policy is proposed yet.
- No EMR UI exists for package sale, session ledger, refund review, or remedy approval.
- The policy body checksum and approved initial version must be generated only from the final
  legally reviewed text.
