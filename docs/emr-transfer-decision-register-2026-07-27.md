# ESCLARE EMR Transfer and Enhancement Decision Register

Date: 2026-07-27

This register is intentionally written before implementation. It records why source-system
behavior is retained, redesigned, deferred, or rejected. No proprietary source code or private
record content is transferred.

## D-001: Reject future patient dates of birth

- Tested source function or issue: ESCLARE patient registration accepts a syntactically valid future
  date and can calculate a negative age.
- Classification: required data-integrity correction.
- Relevance: patient identity, duplicate screening, scheduling context, and future clinical review.
- Required or optional: required.
- Decision: implement. This is a non-clinical validity rule and does not infer treatment policy.
- Expected operational benefit: prevents invalid identity records before they enter permanent
  history.
- Patient-safety impact: reduces age/identity errors.
- Privacy/security impact: improves matching integrity without collecting additional data.
- Financial impact: reduces indirect risk of linking transactions to an invalid identity.
- Historical-record impact: prevents new invalid history; does not rewrite existing records.
- Data-model impact: no column change. Add validation at application and database write boundaries.
- Implementation approach: add a reusable past-or-present date rule to the Zod schema; add a
  database trigger guard for inserts/updates; test application and migration contracts.
- Rollback approach: revert the application change and drop the new trigger/function using a
  separately reviewed forward migration. Do not edit migration history after deployment.
- Required tests: valid past date passes; current date passes; future date fails with a clear
  message; database migration defines the guard and verification query.
- Final test result: application validation, safe age fallback, migration contract, lint,
  typecheck, 81 unit tests, environment contract, production build, and 20 patient workflow checks
  across five desktop/mobile browser projects passed. The SQL migration was not applied because no
  isolated Supabase target is configured.
- Final status: implemented and verified in source; database deployment deferred until backup and
  staging gates pass.

## D-002: Service/package discovery and import

- Tested source function or issue: EaseThetics exposes service/package search, filters, sorting,
  add, export, and staged file validation.
- Classification: relevant and beneficial, with redesign required for historical safety.
- Relevance: catalog administration and future package operations.
- Required or optional: catalog discovery required; import/export optional until migration policy.
- Decision: retain workflow intent, not source implementation. Defer import/export.
- Expected operational benefit: efficient catalog maintenance.
- Patient-safety impact: consistent treatment naming supports accurate selection.
- Privacy/security impact: imports/exports require permission, schema validation, and redacted
  errors.
- Financial impact: historical service/package prices must never be replaced by current prices.
- Historical-record impact: archive/version records instead of destructive delete.
- Data-model impact: existing service and price-version foundation; package ledger still required.
- Implementation approach: future validated staging import with dry-run and immutable price
  versions.
- Rollback approach: reject the staging batch before commit or reverse by batch identifier without
  deleting referenced history.
- Required tests: invalid file, duplicate service, archived service, historical price, permission,
  idempotent rerun, and rollback.
- Final test result: not run; implementation deferred.
- Final status: deferred pending approved schema/export.

## D-003: Appointment workflow

- Tested source function or issue: EaseThetics exposes calendar/filtering plus cancel/delete
  concepts; ESCLARE has atomic status transitions and immutable events.
- Classification: required; destructive behavior is unsafe.
- Relevance: core clinic operations.
- Required or optional: required.
- Decision: retain ESCLARE transition model and use source filters as parity requirements. Reject
  permanent deletion.
- Expected operational benefit: clear scheduling with recoverable history.
- Patient-safety impact: preserves appointment context and cancellation history.
- Privacy/security impact: branch and permission checks remain mandatory.
- Financial impact: future cancellation/no-show charges require owner confirmation.
- Historical-record impact: immutable events preserve chronology.
- Data-model impact: no immediate change.
- Implementation approach: existing atomic RPC plus future filter parity work.
- Rollback approach: forward status correction/addendum; never delete the event history.
- Required tests: allowed/forbidden transitions, overlap, branch access, audit event, retry, and
  concurrent update.
- Final test result: current unit contract passes; staging database verification pending.
- Final status: retained; deeper parity deferred.

## D-004: Patient deletion versus archive

- Tested source function or issue: source patient screen exposes a delete command.
- Classification: unsafe for protected medical history.
- Relevance: patient lifecycle.
- Required or optional: archive is required; deletion transfer is rejected.
- Decision: do not copy destructive deletion. Use archive reason, actor, timestamp, audit, and
  restricted restoration.
- Expected operational benefit: staff can remove inactive records from active views without losing
  history.
- Patient-safety impact: protects longitudinal history.
- Privacy/security impact: archive does not relax RLS or disclosure controls.
- Financial impact: preserves linked transactions.
- Historical-record impact: beneficial and mandatory.
- Data-model impact: existing archive fields/permission foundation.
- Implementation approach: keep permanent delete prohibited and complete the archive workflow only
  after restoration/offboarding rules are approved.
- Rollback approach: authorized unarchive with reason and audit event.
- Required tests: permission, branch scope, reason required, active-list exclusion, archived-list
  visibility, restoration, and linked-history preservation.
- Final test result: route/permission boundary exists; complete workflow deferred.
- Final status: source behavior rejected; archive redesign retained.

## D-005: Package, session, and financial ledgers

- Tested source function or issue: source exposes package, POS, sales, purchase, expense,
  commission, report, and void concepts; ESCLARE currently has demo counters/placeholders.
- Classification: required but requires redesign and owner confirmation.
- Relevance: core entitlements and finance.
- Required or optional: required for full EMR release.
- Decision: keep features disabled. Do not transfer counters or undocumented calculations.
- Expected operational benefit: future accurate balances, sessions, payments, and reconciliation.
- Patient-safety impact: prevents duplicate/negative session deductions.
- Privacy/security impact: financial and clinical access must be separated and audited.
- Financial impact: critical; requires immutable ledgers, idempotency, reversals, and original-value
  preservation.
- Historical-record impact: critical; historical prices and transactions remain unchanged.
- Data-model impact: new package, session, invoice, payment, credit, refund, and reversal ledgers.
- Implementation approach: policy approval, schema design, threat review, migration dry-run, then
  synthetic end-to-end testing.
- Rollback approach: transaction rollback before commit; compensating ledger entries after commit.
- Required tests: negative and duplicate deduction prevention, duplicate payment prevention,
  partial payment, credit/refund/void, concurrency, audit, and reconciliation.
- Final test result: not run; prerequisites missing.
- Final status: deferred and not authorized for implementation.

## D-006: Patient-data migration

- Tested source function or issue: live source workflow is mapped, but no authorized structured
  export/API or destination backup is available.
- Classification: required gate, currently blocked.
- Relevance: eventual transition to ESCLARE.
- Required or optional: required before production cutover.
- Decision: do not migrate or visually copy records.
- Expected operational benefit: none until safe prerequisites exist.
- Patient-safety impact: prevents incomplete or mislinked histories.
- Privacy/security impact: prevents uncontrolled extraction of sensitive data.
- Financial impact: prevents unreconciled balances and duplicate transactions.
- Historical-record impact: prevents destructive overwrite or loss of stable identifiers.
- Data-model impact: legacy-ID fields, staging tables, migration batches, exception records, and
  reconciliation evidence will be required.
- Implementation approach: vendor-supported export/API, encrypted backup, field map, idempotent
  importer, three-pass verification, and controlled cutover.
- Rollback approach: restore destination backup or reverse a complete migration batch while leaving
  source records unchanged.
- Required tests: dry-run, rerun/idempotency, ambiguous duplicate quarantine, relationships,
  aggregates, permissions, attachments, and rollback rehearsal.
- Final test result: not run.
- Final status: blocked; no production-data change authorized.
