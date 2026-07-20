# Controlled Production Scope

Status: source-defined; production approval pending external gates.

## Approved After Deployment Verification

- Public informational website, branches, treatments, gallery, FAQ, privacy, terms, and contact links.
- Hero poster-first presentation and video fallback.
- Read-only staff service catalog.
- Process liveness endpoint.

## Limited Pilot

These require `pilot` mode, an explicit production `FEATURE_PILOT_STAFF_IDS` allowlist, trained
staff, synthetic records, backup/restore, staged migrations, live RLS tests, and production smoke
approval:

- Staff authentication and required MFA.
- Patient registration, directory, profile, and audited contact reveal.
- Appointment creation, transitions, cancellation, and public-request processing.
- Read-only audit review.

## Disabled Or Deferred

Dashboard metrics, patient editing/archive/merge, appointment rescheduling, clinical encounters,
signed notes, consent, clinical photographs, payments, refunds, packages, inventory,
prescriptions, advanced reports, exports, staff/role management, marketing, notifications,
integrations, patient portal, and backup administration are disabled by default. Their navigation
is hidden and direct implemented routes reject access when the corresponding server flag is off.
No production capability may be inferred from permissions or placeholder code.

Public appointment requests prepare a clinic handoff. Database persistence is not production-
approved until Supabase runtime gates pass.
