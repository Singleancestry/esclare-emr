# Feature Flag Inventory

Modes are `off`, `pilot`, and `on`. Missing or invalid values fail closed in production. `pilot`
requires the authenticated employee UUID in `FEATURE_PILOT_STAFF_IDS`. Development defaults only
patients, appointments, and audit review to pilot for synthetic testing.

| Flag                                | Production default | Release state                       |
| ----------------------------------- | ------------------ | ----------------------------------- |
| `ENABLE_PATIENTS`                   | `pilot`            | Limited pilot after all gates       |
| `ENABLE_APPOINTMENTS`               | `pilot`            | Limited pilot after all gates       |
| `ENABLE_AUDIT_READ`                 | `pilot`            | Limited pilot after all gates       |
| `ENABLE_PUBLIC_BOOKING_PERSISTENCE` | `off`              | Enable after Supabase request tests |
| `ENABLE_DASHBOARD`                  | `off`              | Deferred; demo metrics              |
| `ENABLE_PATIENT_ARCHIVE`            | `off`              | Deferred; lifecycle absent          |
| `ENABLE_CLINICAL_RECORDS`           | `off`              | Deferred                            |
| `ENABLE_CLINICAL_PHOTOS`            | `off`              | Deferred                            |
| `ENABLE_PAYMENTS`                   | `off`              | Deferred                            |
| `ENABLE_PACKAGE_BALANCES`           | `off`              | Deferred                            |
| `ENABLE_INVENTORY`                  | `off`              | Deferred                            |
| `ENABLE_ADVANCED_REPORTS`           | `off`              | Deferred                            |
| `ENABLE_STAFF_MANAGEMENT`           | `off`              | Deferred                            |
| `ENABLE_MARKETING`                  | `off`              | Deferred                            |
| `ENABLE_INTEGRATIONS`               | `off`              | Deferred                            |
| `ENABLE_ROLE_MANAGEMENT`            | `off`              | Deferred                            |
| `ENABLE_SECURITY_SETTINGS`          | `off`              | Deferred                            |
| `ENABLE_DATA_EXPORT`                | `off`              | Deferred                            |

Flags limit release scope; permissions, server checks, service-role RPC ACLs, RLS, and audited
transactions remain independent enforcement boundaries. Changing a production flag requires a
reviewed commit or environment change, ticket, owner, approval evidence, and rollback plan.
