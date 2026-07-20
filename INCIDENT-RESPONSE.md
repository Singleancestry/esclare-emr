# ESCLARE Incident Response Runbook

Status: operational draft requiring clinic owner, DPO, and legal review  
Timezone: Asia/Manila

This runbook supports technical response and evidence preservation. It does not claim legal compliance or replace advice from the clinic's Data Protection Officer or legal counsel.

## Severity Levels

| Severity | Definition                                                                                                                                       | Initial response target                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| SEV-1    | Confirmed or strongly suspected C3/C4 disclosure, active account takeover, destructive production activity, or public storage/RLS exposure       | Immediate; notify clinic owner, DPO, and engineering |
| SEV-2    | Contained security control failure with possible sensitive-data impact, privileged credential exposure, or repeated unauthorized access attempts | Within 30 minutes                                    |
| SEV-3    | Security or reliability issue without evidence of sensitive-data access                                                                          | Same business day                                    |
| SEV-4    | Low-risk defect, policy gap, or unsuccessful probe                                                                                               | Normal issue workflow                                |

## First Response

1. Start an incident record using a non-patient identifier and record all times in Asia/Manila and UTC.
2. Assign an incident lead, evidence custodian, communications lead, and clinical/business owner.
3. Preserve logs and deployment/database configuration before changing them. Do not paste secrets or patient data into tickets or chat.
4. Contain the narrowest affected surface. Avoid deleting records or storage objects.
5. Determine the affected environment, accounts, time window, data classes, patients, branches, and actions performed.
6. Notify the clinic owner and DPO. Engage legal counsel for notification and regulatory decisions.

## Evidence Preservation

- Export relevant authentication, audit, database, storage, hosting, and integration logs to an access-controlled incident location.
- Record log source, query/filter, export time, operator, checksum where available, and retention period.
- Preserve affected deployment IDs, commit SHAs, migration versions, RLS policies, environment-variable names, and OAuth scopes without recording secret values.
- Use normal archival or legal-hold procedures. Do not modify original audit events.

## Containment Playbooks

### Credential Leak

1. Identify the credential type and every environment where it is valid.
2. Disable the affected feature or integration if continued use risks exposure.
3. Rotate through the provider's supported process after preserving evidence and confirming dependencies.
4. Revoke prior tokens/sessions, update server-only environment variables, redeploy, and verify the old credential is rejected.
5. Scan current source and full Git history; treat any committed secret as compromised.

### RLS Or Storage Exposure

1. Disable the affected public operation or feature flag.
2. Preserve the active policy definitions, grants, access logs, and affected object paths.
3. Apply a default-deny repair through a reviewed migration in staging first unless active exposure requires an emergency production change.
4. Verify anonymous, cross-patient, cross-branch, and wrong-role access is denied before re-enabling.

### Account Takeover Or Departed Staff

1. Disable the account and revoke all sessions, refresh tokens, integration grants, and recovery methods.
2. Review role and branch changes, record reads, exports, storage access, and admin actions during the suspected window.
3. Reset or re-enroll MFA through a verified identity process.

### Compromised Staff Device Or Ransomware

1. Disconnect the device from clinic networks and accounts without destroying evidence.
2. Revoke sessions and tokens used by the device.
3. Identify synchronized downloads, browser sessions, cached exports, and Google Drive access.
4. Use a qualified incident-response provider for device imaging and recovery.

## Notification Decision Gate

Within the first hours, the DPO and legal counsel should determine whether personal or sensitive personal information may have been accessed, altered, lost, or disclosed and whether notification obligations apply. The response team must give them:

- incident discovery time and best-known occurrence window;
- affected data classes and approximate record/patient count;
- affected people and branches, where determinable;
- likely cause, containment status, and ongoing risk;
- evidence of what records were read, exported, changed, or deleted;
- protective actions available to affected people.

The master command requires readiness for a 72-hour NPC and data-subject notification decision where sensitive personal information is involved. The DPO/legal team owns that decision and the final wording. Record the decision, rationale, approver, and time.

## Draft Notification Content For Legal Review

- What happened and when it was discovered.
- What information may be involved, using plain language and no unnecessary clinical detail.
- What ESCLARE has done to contain and investigate the incident.
- What affected people can do now.
- How to contact ESCLARE's designated privacy contact.
- When the next update will be provided.

## Kill Switches

These procedures must be filled with provider-specific, access-controlled instructions and tested in staging before production approval:

| Capability                         | Immediate action                                                | Verification                                              |
| ---------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| Revoke staff sessions              | Disable affected Supabase Auth users and revoke sessions/tokens | Old session and refresh token are rejected                |
| Rotate application secrets         | Rotate provider secret, update server-only host env, redeploy   | Old secret fails; health/readiness checks pass            |
| Disable public booking persistence | Set `ENABLE_PUBLIC_BOOKING_PERSISTENCE=off` and redeploy        | Public request does not write patient/booking data        |
| Disable clinical modules           | Set clinical, photo, export, and integration feature flags off  | Protected routes/actions fail closed                      |
| Disconnect Google                  | Revoke clinic-owned OAuth grant and disable integration flag    | Sync attempts are blocked and visibly marked disconnected |

## Recovery And Closure

1. Restore service only after the repaired control is independently verified.
2. Monitor for recurrence and delayed token/session use.
3. Reconcile database row counts, booking integrity, storage objects, and integration state.
4. Document root cause, impact, timeline, decisions, tests, and remaining risk.
5. Create tracked remediation work with owners and due dates; update `RISKS.md`, `THREAT-MODEL.md`, and `CHANGELOG-CODEX.md`.
6. Conduct a post-incident review without placing patient data or secret values in the report.
