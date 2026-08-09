# Website reconciliation — 2026-08-09

Source backup: `codex/undeployed-backup-20260809` at `e22806965e4551c6d003587623b76890c6b1a550`.

Target branch: `codex/reconcile-website-updates-20260809`.

## Safe to merge

These source files were merged wholly or selectively:

- `app/(public)/aftercare/page.tsx`
- `app/(public)/glp-1-slimming/page.tsx`
- `app/(public)/page.tsx`
- `app/(public)/skin-education/[slug]/page.tsx`
- `app/(public)/skin-education/category/[category]/page.tsx`
- `app/(public)/skin-education/page.tsx`
- `app/(public)/treatments/[slug]/page.tsx`
- `app/(public)/treatments/page.tsx`
- `components/public/authentic-hero.tsx`
- `components/public/floating-messenger.tsx`
- `components/public/skin-education-explorer.tsx`
- `docs/pricing-reconciliation-2026-08-09.md`
- `lib/clinic/faqs.ts` (PCL terminology only; cautious medical copy retained)
- `lib/content/glp1.ts`
- `lib/content/skin-education.ts` (non-Rejuran articles only)
- `lib/services/catalog.ts`
- `lib/services/details.ts` (specific Pico Glow and Exilift guidance; cautious generic wording retained)
- `tests/unit/seo-schema.test.ts`
- `tests/unit/service-catalog.test.ts`
- `tests/unit/skin-education.test.ts`

The merge also adds redirects from the previous abdomen and flank HIFU URLs to the consolidated HIFU page.

## Already implemented

These source files matched or were superseded by the deployed Reviews and permission implementation, so no duplicate changes were needed:

- `app/(staff)/reviews-manager/page.tsx`
- `app/(staff)/reviews/actions.ts`
- `components/public/homepage-reviews.tsx`
- `components/public/review-card.tsx`
- `components/public/reviews-explorer.tsx`
- `components/reviews/review-manager-form.tsx`
- `lib/permissions/navigation.ts`
- `lib/reviews/data.ts`
- `lib/reviews/types.ts`
- `lib/validation/review.ts`
- `supabase/migrations/202608091200_public_reviews.sql`

## Conflicting with newer requirements

These source changes were not carried over, or only their compatible behavior was retained:

- `app/(public)/about/page.tsx` — retained the current clinic history and team content.
- `app/(public)/reviews/page.tsx` — retained the current Google/Facebook review calls to action and fallback behavior.
- `components/public/site-footer.tsx` — retained the current navigation and security-sensitive staff-link behavior.
- `components/public/site-header.tsx` — retained the current transparent logo, header dimensions, and navigation order; only controlled Treatments-menu behavior and “Request assessment” wording were merged.
- `components/public/attendant-section.tsx` — rejected the shortened, grammatically incomplete replacement copy.
- `public/images/logo/esclare-ring-logo.png` — rejected the older logo asset.
- Rejuran draft articles embedded in `lib/content/skin-education.ts` — removed from the merged publishing update.

## Requires approval before a future merge

- Serum/add-on prices not confirmed by the approved service menu.
- Combination-treatment prices and promotional prices.
- Branch-specific Carbon Laser Peel values where the workbook contains duplicates or ambiguity.
- Any future public Rejuran treatment or education content, pending explicit clinic and regulatory approval.
- Any replacement of the current About-page history, logo, header, navigation order, Reviews experience, MCCM page, or access-control protections.

## Preserved requirements

- No GLP-1 price is displayed publicly; the program is described as a physician-supervised four-week treatment program.
- The current transparent ESCLARE logo and navigation order remain in place.
- The current Reviews system and MCCM page remain in place.
- No Rejuran article is published or present in the Skin Education library.
- Existing authentication, permissions, RLS, private-route headers, and staff-route protections are unchanged.
