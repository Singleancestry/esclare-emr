# Migration Risk Manifest

Migrations `1100`-`1390` are source-reviewed but unapplied. Apply only to a restored/disposable
Supabase project first, in filename order, with `ON_ERROR_STOP`, before/after schema snapshots,
verification SQL, live JWT tests, concurrency tests, and rollback/forward-repair rehearsal.

| Range  | Purpose                             | Principal risk                      | Required precheck/recovery                           |
| ------ | ----------------------------------- | ----------------------------------- | ---------------------------------------------------- |
| `1100` | Revoke direct writes/default grants | Existing clients fail               | Inventory direct calls; forward-repair grants only   |
| `1200` | Mask/revoke patient columns         | Generated-column scan/lock          | Size/mobile audit; maintenance window                |
| `1300` | Atomic appointments/exclusion       | Existing overlap and strong lock    | Detect conflicts; replace function forward           |
| `1310` | Atomic patient graph/dedup          | Concurrency and input casts         | Race/rollback tests; never revert to partial writes  |
| `1320` | Branch permission context           | Immediate auth behavior change      | Multi-branch/future assignment JWT tests             |
| `1330` | Request idempotency/quota           | Table/index lock and legacy nulls   | Size/lock budget; replay and sixth-request tests     |
| `1340` | Atomic contact reveal               | Privacy authorization semantics     | Home-branch policy confirmed; failure rollback test  |
| `1350` | Operational indexes                 | Disk/WAL/write blocking             | Capacity and query plans; forward-drop invalid index |
| `1360` | Database AAL2 boundary              | AAL1 access stops                   | AAL1/AAL2 tests including staff-context denial       |
| `1370` | Quota lookup index                  | Build lock                          | Query plan and write-traffic window                  |
| `1380` | Identity-table lockdown             | Direct IAM clients stop             | Confirm all context reads use reviewed RPC           |
| `1385` | Operational-table lockdown          | Direct client reads stop            | Confirm reads use permission-checked server services |
| `1390` | Release marker                      | Readiness remains red until applied | Verify service-only ACL and endpoint result          |

Stop on any failed migration. Preserve logs, do not apply later files, restore the staging snapshot
or apply the reviewed forward repair, and repeat the complete staging gate.
