# ESCLARE EMR Privacy and Retention Plan

Date: 2026-08-02
Status: technical baseline requiring Philippine legal and clinic-policy review

## Principles

- Collect only data needed for care, scheduling, payment, safety, or a documented legal purpose.
- Separate basic identity, contact, clinical, financial, photo, and authentication access.
- Apply branch scope and least privilege on the server and in RLS.
- Keep patient and health information out of URLs, analytics, client logs, and notification previews.
- Use correction, archive, addendum, reversal, and audit workflows instead of destructive deletion.

## Data Classes

| Class | Examples | Default access | Protection |
| --- | --- | --- | --- |
| Identity/contact | name, phone, address | reception and authorized care roles | masked by default; reveal audited |
| Clinical | history, alerts, notes, parameters | assigned clinical team and doctor | RLS, versioning, signing, addenda |
| Photos/files | before/after and signed forms | specifically permitted care roles | private storage, signed URLs, access log |
| Financial | invoices, payments, refunds | cashier, management, auditor | immutable ledger and approval controls |
| Authentication | sessions, MFA, trusted devices | account owner and security admins | never exported or logged as raw tokens |
| Audit | actor, action, entity, reason | owner/security/auditor | append-only and restricted |

## Retention Decisions Required

The repository must not invent legal retention periods. The owner and qualified Philippine counsel
must approve schedules for clinical records, signed consent, photographs, financial records, audit
events, rejected appointment requests, staff records, and backups. Until then, protected records are
archived rather than permanently deleted.

## Operational Controls

- Record purpose and consent version where consent is the lawful basis.
- Support correction requests without rewriting signed history.
- Revoke staff access promptly on role change or separation.
- Require permission and reason for exports; watermark and audit sensitive exports.
- Test backups and restoration without placing real patient data in development.
- Maintain an incident register, containment procedure, notification decision record, and credential rotation checklist.
- Use synthetic records such as `Reagan-Test`, clearly marked test-only, in isolated testing.

This plan is not a legal-compliance certification. Legal notices, retention periods, breach reporting,
and data-subject procedures require professional review and owner approval.
