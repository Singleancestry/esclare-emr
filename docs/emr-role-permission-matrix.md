# ESCLARE EMR Role and Permission Matrix

Date: 2026-08-02
Status: code-aligned baseline; server and RLS enforcement remain mandatory

Roles currently modeled: Owner, Super Admin, Branch Manager, Receptionist, Cashier, Aesthetician,
Nurse, Doctor, Inventory Officer, Auditor, and Patient.

Legend: `F` full, `B` branch-scoped, `A` assigned-patient/encounter only, `R` read-only, `-` denied.

| Area / action | Owner | Super Admin | Branch Manager | Receptionist | Cashier | Aesthetician | Nurse | Doctor | Inventory | Auditor |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | F | F | B | B | B | B | B | B | B | R |
| Patient basic view | F | F | B | B | B | B | B | B | - | R |
| Patient create/update | F | F | B | B | - | - | - | - | - | - |
| Contact reveal | F | F | B | B | - | - | B | B | - | audited only |
| Medical summary | F | F | B | - | - | A | A | B | - | audited R |
| Full clinical record | F | F | - | - | - | A | A | B | - | audited R |
| Sign clinical note | F | F | - | - | - | - | - | B | - | - |
| Clinical photo upload | F | F | - | - | - | A | A | B | - | - |
| Clinical photo download | F | F | - | - | - | - | - | B | - | - |
| Appointment create/change | F | F | B | B | - | limited | B | B | - | - |
| Price propose/approve/publish | F | F | propose/approve | - | - | - | - | - | - | R |
| Payment create | F | F | policy-controlled | - | B | - | - | - | - | R |
| Refund/void | F | F | approval policy | request only | request only | - | - | - | - | R |
| Package sale/use/adjust | F | F | policy-controlled | view | sell | use | use | use | - | R |
| Inventory receive/adjust/transfer | F | F | oversight | - | - | - | consume | - | B | R |
| Reports/export | F | F | B | - | B | - | - | clinical only | B | audited R |
| Employee/user management | F | F | view only | - | - | - | - | - | - | R |
| Role management | F | F | - | - | - | - | - | - | - | R |
| Audit log review | F | F | B | - | - | - | - | - | - | R |

## Enforcement Rules

- UI visibility is never the authorization boundary.
- Every mutation uses `requirePermission` or an equivalent server check and branch scope.
- RLS remains enabled on every sensitive operational table.
- Exports require permission, reason, minimum-necessary fields, and an audit event.
- Corrections use archive, addendum, reversal, refund, or adjustment records; protected records are not deleted.
- Auditor access is read-only and sensitive access is logged.
- Exact refund limits, price approval thresholds, and doctor delegation require owner policy approval.
