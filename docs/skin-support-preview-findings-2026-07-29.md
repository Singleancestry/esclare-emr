# Skin Support Preview Findings - 2026-07-29

Working branch: `codex/skin-support-preview-20260729`

This register records the baseline before implementation. It is a preview-only workstream. No
production deployment, production data update, or production Supabase migration is authorized.

## Critical

| ID   | Finding                                                                                                                                                                                                                                                     | Impact                                                                                          | Preview decision                                                                                                                                                                                    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-01 | Current Philippine FDA advisories identify specific Rejuran products as unregistered, and no current Philippine authorization for the exact Rejuran Healer, I, or S products has been verified.                                                             | Publishing availability or regulatory claims could mislead patients and create regulatory risk. | Keep Rejuran pages review-only, non-indexable, and unavailable for direct booking until the clinic supplies exact product, supplier, and current Philippine authorization evidence.                 |
| C-02 | The requested MCCM Eye treatment is classified by the clinic as doctor-administered, while the official Out Contour Cocktail page describes a topical professional product and states "DO NOT INJECT." No matching Philippine FDA record has been verified. | Route-of-administration ambiguity is a patient-safety risk.                                     | Describe only verified topical use, state the clinic's doctor-assessment policy separately, and block production publication until the exact clinic protocol and local product record are verified. |

## High

| ID   | Finding                                                                                                                                                 | Impact                                                                                    | Preview decision                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| H-01 | The package and sessions staff route is only a feature-gated placeholder. No package ledger, purchase, consent, refund, or policy-version tables exist. | The requested legal acknowledgment and refund workflow cannot be represented as complete. | Build public policy presentation and a migration proposal with rollback notes; do not enable the staff feature or claim an operational EMR workflow. |
| H-02 | Existing Rejuran treatments are public catalog entries and are included in generated routes and the sitemap.                                            | Unverified treatment availability is currently indexable.                                 | Convert the entries to preview-only and exclude them from production static generation and sitemap output.                                           |
| H-03 | The current combined MCCM page conflates three products, prices, classifications, and regulatory states.                                                | Patients cannot distinguish price, administration policy, or product status.              | Replace it with separate Skin Support entries and dedicated content.                                                                                 |

## Medium

| ID   | Finding                                                                                           | Impact                                                                                     | Preview decision                                                                                                                                 |
| ---- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| M-01 | Laser Circumcision was listed at `Starts at PHP 3,999`; the approved revision is PHP 5,000.       | Stale price could create booking disputes.                                                 | Resolved in the preview catalog and regression test.                                                                                             |
| M-02 | Main navigation is flat and does not expose the required Treatment > Skin Support hierarchy.      | Skin Support pages are harder to discover.                                                 | Add an accessible desktop disclosure and a clear mobile Skin Support group while keeping Skin Education separate.                                |
| M-03 | All Skin Education articles are unpublished and require medical review.                           | Publishing new medical articles now would bypass the editorial gate.                       | Add Rejuran education drafts as `medical-review-required`; expose only in local/preview review mode and keep them out of the production sitemap. |
| M-04 | No dedicated Naga branch route existed while Daet had one.                                        | Local search/entity coverage was inconsistent.                                             | Resolved using the verified address, phone, map, hours, and authentic photography already present in the clinic data.                            |
| M-05 | `robots.ts` does not distinguish Vercel preview from production and the allow list is incomplete. | Preview content could be crawled and approved public pages are not explicitly represented. | Return a full-site disallow in preview deployments and add private-route noindex headers.                                                        |

## Low

| ID   | Finding                                                                                              | Impact                                                              | Preview decision                                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| L-01 | Treatment detail pages use one generic medical template, including inferred timing and process text. | Product-specific pages can accidentally imply unverified protocols. | Add a verified-content Skin Support template that omits unknown duration, downtime, or frequency instead of estimating them. |

## Owner And Legal Review Required

- Confirm the exact MCCM product packaging, formulation, lot/source, and Philippine responsible
  company used at each branch.
- Confirm whether the MCCM eye service is topical only and provide the clinic-approved protocol.
- Provide current Philippine authorization and authorized-supplier evidence for each exact Rejuran
  product before any treatment page is published or booking enabled.
- Have a qualified Philippine legal professional review the package Terms and Conditions before
  they are used for purchase, consent, refund, forfeiture, or remedy decisions.
- Provide verified Naga branch address, phone, maps link, and public opening hours.
