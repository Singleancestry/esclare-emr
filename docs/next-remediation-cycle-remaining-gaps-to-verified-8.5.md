# Next Remediation Cycle - Remaining Gaps To Verified 8.5

Current reconciled score: **6.8/10**. Target: **8.5/10**.

## External Inputs Required

1. Confirmed Supabase production project ref/region, owner access, backup/PITR capability, database
   credentials, storage recovery method, and an isolated recovery/staging project.
2. Synthetic AAL1/AAL2 users for each role and branch, including suspended/expired cases.
3. Authenticated GitHub and Vercel access, authoritative deployment provider, environment inventory,
   domain, and production logs.
4. Monitoring provider, notification route, named engineering/security/recovery/privacy owners,
   approved RPO/RTO, and alert acknowledgement targets.

## Execution

1. Record branch and freeze a reviewed commit without secrets.
2. Create and hash database/storage backups; restore into isolation and measure RPO/RTO.
3. Apply migrations `1100`-`1390` in order; run every verifier and schema diff.
4. Run real JWT/RLS, AAL2, branch, ACL, storage, rollback, and two-connection concurrency tests.
5. Verify pilot flags deny non-allowlisted staff and every disabled direct route/action.
6. Deploy the exact reviewed commit to preview; verify commit hash and non-production data isolation.
7. Trigger and receive every SEV1/SEV2 staging alert; record owner acknowledgement.
8. Apply approved migrations and exact commit only after all prior gates pass.
9. Run synthetic production smoke, deployed hero/CDN matrix, logs, readiness, and rollback check.
10. Obtain independent unanimous approval for backup, migrations, authorization, audit integrity,
    disabled finance/photos/packages, and commit matching; recalculate using the lowest credible score.

Stop immediately on backup/restore failure, migration failure, sensitive-data exposure, live RLS
failure, hash mismatch, missing alert delivery, or any unresolved critical/high issue.
