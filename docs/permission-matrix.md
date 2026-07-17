# Permission Matrix

The canonical seed lives in `database/seeds/001_roles_permissions.sql`. Application code mirrors the same keys in `lib/permissions/permissions.ts`.

| Permission                | Owner | Super Admin | Branch Manager | Receptionist | Cashier | Aesthetician | Nurse    | Doctor | Inventory | Marketing | Auditor | Patient |
| ------------------------- | ----- | ----------- | -------------- | ------------ | ------- | ------------ | -------- | ------ | --------- | --------- | ------- | ------- |
| `dashboard.owner.view`    | yes   | yes         | no             | no           | no      | no           | no       | no     | no        | no        | no      | no      |
| `dashboard.branch.view`   | yes   | yes         | yes            | yes          | yes     | yes          | yes      | yes    | yes       | yes       | yes     | no      |
| `patients.view_basic`     | yes   | yes         | yes            | yes          | yes     | yes          | yes      | yes    | no        | yes       | yes     | self    |
| `patients.reveal_contact` | yes   | yes         | yes            | yes          | no      | no           | yes      | yes    | no        | no        | audit   | self    |
| `medical.view_summary`    | yes   | yes         | yes            | no           | no      | yes          | yes      | yes    | no        | no        | yes     | self    |
| `medical.view_full`       | yes   | yes         | no             | no           | no      | assigned     | assigned | yes    | no        | no        | audit   | self    |
| `appointments.create`     | yes   | yes         | yes            | yes          | no      | no           | yes      | yes    | no        | no        | no      | request |
| `payments.create`         | yes   | yes         | yes            | no           | yes     | no           | no       | no     | no        | no        | no      | no      |
| `prices.approve`          | yes   | yes         | yes            | no           | no      | no           | no       | no     | no        | no        | no      | no      |
| `security.view_audit`     | yes   | yes         | yes            | no           | no      | no           | no       | no     | no        | no        | yes     | no      |
| `security.manage_roles`   | yes   | yes         | no             | no           | no      | no           | no       | no     | no        | no        | no      | no      |

`assigned` means the user must also be assigned to the patient or encounter. `self` means patient portal access is restricted to the authenticated patient. Full matrix expansion is seeded for Phase 1 roles.
