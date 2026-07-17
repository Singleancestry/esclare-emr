# Clinical Release Readiness

ESCLARE must not be represented as ready for live clinical records until every gate below is complete and independently verified.

## Current Gates

- Phase 4 scheduling is in progress and is not yet deployed.
- Phase 5 clinical encounters, consent, signatures, record locking, addendums and clinical-photo controls are not implemented.
- Phase 6 payments and package ledgers are not implemented.
- Phase 7 inventory, finance reconciliation and operational reports are not implemented.
- Production MFA enrollment has not been verified for every privileged employee.
- Supabase Free does not provide the required managed backup and restore capability.
- Disaster recovery, restore testing, retention rules and incident response drills are outstanding.
- Production RLS requires automated role-by-role integration tests against an isolated Supabase test project.
- Privacy, retention, breach response and clinical governance require review by ESCLARE management and qualified Philippine legal/privacy advisers.

## Release Rule

Do not connect the final domain, import real patient records, accept live payments or store clinical photographs until all applicable gates pass. Preview environments may contain fictional test data only.
