# Monitoring And Incident Runbook

## Endpoints

- `GET /api/health` and `/api/health/live`: public process liveness, `no-store`.
- `GET /api/health/ready`: requires `Authorization: Bearer HEALTH_CHECK_TOKEN`, checks Supabase
  and schema marker `202607181390`, times out after two seconds, and returns no data records.

Operational logs contain fixed event names, severity, environment, release, request ID,
operation, outcome, normalized code, dependency, and duration. Never log bodies, query strings,
names, contact details, patient or clinical identifiers, reasons, notes, cookies, authorization
headers, tokens, keys, raw database errors, or audit payloads.

## Alerts

| Trigger                                    | Severity | Role owner            | Initial action                                     |
| ------------------------------------------ | -------- | --------------------- | -------------------------------------------------- |
| Readiness fails twice in 3 minutes         | SEV1     | Engineering on-call   | Disable pilot writes; inspect provider status      |
| Backup missed/failed or RPO exceeded       | SEV1     | Recovery owner        | Stop migrations and deployment                     |
| Migration or audit-atomic write fails      | SEV1     | Database and security | Stop rollout; preserve logs                        |
| Possible sensitive-data telemetry          | SEV1     | Privacy/security      | Disable affected telemetry and contain             |
| Patient/appointment save failure threshold | SEV2     | EMR owner             | Disable affected flag; reconcile synthetic records |
| Authorization denials spike                | SEV2     | Security              | Investigate pseudonymous pattern and revoke access |
| Deployment or smoke gate fails             | SEV2     | Release owner         | Roll back exact deployment                         |
| Hero failures exceed 2%/50 sessions        | SEV3     | Website owner         | Verify media/CDN; poster remains service state     |

Named people, notification services, acknowledgement targets, and escalation contacts must be
assigned outside source control before production approval. Every SEV1/SEV2 alert must be
deliberately triggered and received in staging.

## Response

1. Acknowledge and assign an incident ID without patient information.
2. Freeze deployments and risky writes; disable the affected feature flag when possible.
3. Preserve release hash, request IDs, sanitized logs, provider status, and migration version.
4. Revoke compromised sessions or credentials; never inspect clinical content in telemetry.
5. Restore service using the tested rollback or recovery runbook.
6. Reconcile synthetic checks and verify audit consistency before re-enabling.
7. Record timeline, cause, impact category, corrective action, and owner.

Privacy/legal leadership must define breach notification, DPO ownership, retention, RPO, and RTO.
