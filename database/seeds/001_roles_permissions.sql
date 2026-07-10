insert into public.permissions (key, category, description)
values
  ('dashboard.owner.view', 'dashboard', 'View owner dashboard'),
  ('dashboard.branch.view', 'dashboard', 'View branch dashboard'),
  ('patients.view_basic', 'patients', 'View basic patient directory data'),
  ('patients.create', 'patients', 'Create patients'),
  ('patients.update_basic', 'patients', 'Update basic patient data'),
  ('patients.archive', 'patients', 'Archive patients'),
  ('patients.reveal_contact', 'patients', 'Reveal masked patient contact details'),
  ('patients.export', 'patients', 'Export permitted patient lists'),
  ('medical.view_summary', 'medical', 'View medical summary alerts'),
  ('medical.view_full', 'medical', 'View full medical history'),
  ('medical.create', 'medical', 'Create medical records'),
  ('medical.update', 'medical', 'Update unlocked medical records'),
  ('medical.sign', 'medical', 'Sign clinical records'),
  ('medical.add_addendum', 'medical', 'Add medical record addendums'),
  ('clinical_photos.view', 'clinical_photos', 'View permitted clinical photos'),
  ('clinical_photos.upload', 'clinical_photos', 'Upload clinical photos'),
  ('clinical_photos.download', 'clinical_photos', 'Download clinical photos'),
  ('clinical_photos.view_sensitive', 'clinical_photos', 'View sensitive clinical photos'),
  ('appointments.view', 'appointments', 'View appointments'),
  ('appointments.create', 'appointments', 'Create appointments'),
  ('appointments.confirm', 'appointments', 'Confirm appointments'),
  ('appointments.reschedule', 'appointments', 'Reschedule appointments'),
  ('appointments.cancel', 'appointments', 'Cancel appointments'),
  ('appointments.check_in', 'appointments', 'Check in patients'),
  ('appointments.start_treatment', 'appointments', 'Start treatment workflow'),
  ('appointments.complete', 'appointments', 'Complete appointments'),
  ('services.view', 'services', 'View treatment catalog'),
  ('services.create', 'services', 'Create treatments'),
  ('services.update', 'services', 'Update treatments'),
  ('services.archive', 'services', 'Archive treatments'),
  ('prices.view', 'prices', 'View prices'),
  ('prices.propose', 'prices', 'Propose price changes'),
  ('prices.approve', 'prices', 'Approve price changes'),
  ('prices.publish', 'prices', 'Publish price versions'),
  ('payments.create', 'payments', 'Create payments'),
  ('payments.view', 'payments', 'View payment records'),
  ('payments.refund_request', 'payments', 'Request refunds'),
  ('payments.refund_approve', 'payments', 'Approve refunds'),
  ('payments.void_request', 'payments', 'Request voids'),
  ('payments.void_approve', 'payments', 'Approve voids'),
  ('packages.view', 'packages', 'View packages'),
  ('packages.sell', 'packages', 'Sell packages'),
  ('packages.use_session', 'packages', 'Use package sessions'),
  ('packages.adjust_session', 'packages', 'Adjust package sessions'),
  ('inventory.view', 'inventory', 'View inventory'),
  ('inventory.receive', 'inventory', 'Receive stock'),
  ('inventory.consume', 'inventory', 'Consume stock'),
  ('inventory.adjust', 'inventory', 'Adjust stock'),
  ('inventory.transfer', 'inventory', 'Transfer stock'),
  ('reports.view_branch', 'reports', 'View branch reports'),
  ('reports.view_all', 'reports', 'View all-branch reports'),
  ('reports.export', 'reports', 'Export reports'),
  ('employees.view', 'employees', 'View employees'),
  ('employees.create', 'employees', 'Create employees'),
  ('employees.update', 'employees', 'Update employees'),
  ('employees.disable', 'employees', 'Disable employees'),
  ('security.view_audit', 'security', 'View audit logs'),
  ('security.manage_roles', 'security', 'Manage roles and permissions'),
  ('security.manage_devices', 'security', 'Manage trusted devices'),
  ('security.break_glass', 'security', 'Use emergency access')
on conflict (key) do update set
  category = excluded.category,
  description = excluded.description;

insert into public.roles (key, name, description, privileged)
values
  ('owner', 'Owner', 'Clinic owner with all permissions', true),
  ('super_admin', 'Super Admin', 'System administrator with all permissions', true),
  ('branch_manager', 'Branch Manager', 'Branch operations manager', true),
  ('receptionist', 'Receptionist', 'Front desk and appointment staff', false),
  ('cashier', 'Cashier', 'POS and payment staff', false),
  ('aesthetician', 'Aesthetician', 'Aesthetic treatment provider', false),
  ('nurse', 'Nurse', 'Clinical nursing provider', false),
  ('doctor', 'Doctor', 'Doctor and medical sign-off provider', true),
  ('inventory_officer', 'Inventory Officer', 'Inventory and purchasing staff', false),
  ('marketing', 'Marketing', 'CRM and campaign staff', false),
  ('auditor', 'Auditor', 'Audit and read-only review staff', true),
  ('patient', 'Patient', 'Patient portal user', false)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  privileged = excluded.privileged;

with role_permission_map(role_key, permission_key) as (
  select 'owner', key from public.permissions
  union all select 'super_admin', key from public.permissions
  union all select 'branch_manager', unnest(array[
    'dashboard.branch.view','patients.view_basic','patients.create','patients.update_basic',
    'patients.archive','patients.reveal_contact','medical.view_summary','appointments.view',
    'appointments.create','appointments.confirm','appointments.reschedule','appointments.cancel',
    'services.view','prices.view','prices.propose','prices.approve','payments.view',
    'packages.view','inventory.view','reports.view_branch','employees.view','security.view_audit',
    'security.manage_devices'
  ])
  union all select 'receptionist', unnest(array[
    'dashboard.branch.view','patients.view_basic','patients.create','patients.update_basic',
    'patients.reveal_contact','appointments.view','appointments.create','appointments.confirm',
    'appointments.reschedule','appointments.cancel','appointments.check_in','packages.view'
  ])
  union all select 'cashier', unnest(array[
    'dashboard.branch.view','patients.view_basic','appointments.view','payments.create',
    'payments.view','payments.refund_request','payments.void_request','packages.view',
    'packages.sell','reports.view_branch'
  ])
  union all select 'aesthetician', unnest(array[
    'dashboard.branch.view','patients.view_basic','medical.view_summary','medical.create',
    'medical.update','clinical_photos.view','clinical_photos.upload','appointments.view',
    'appointments.start_treatment','appointments.complete','packages.view','packages.use_session'
  ])
  union all select 'nurse', unnest(array[
    'dashboard.branch.view','patients.view_basic','patients.reveal_contact','medical.view_summary',
    'medical.create','medical.update','clinical_photos.view','clinical_photos.upload',
    'appointments.view','appointments.create','appointments.start_treatment','appointments.complete',
    'packages.use_session','inventory.consume'
  ])
  union all select 'doctor', unnest(array[
    'dashboard.branch.view','patients.view_basic','patients.reveal_contact','medical.view_summary',
    'medical.view_full','medical.create','medical.update','medical.sign','medical.add_addendum',
    'clinical_photos.view','clinical_photos.upload','clinical_photos.download',
    'clinical_photos.view_sensitive','appointments.view','appointments.create',
    'appointments.start_treatment','appointments.complete','packages.use_session'
  ])
  union all select 'inventory_officer', unnest(array[
    'dashboard.branch.view','inventory.view','inventory.receive','inventory.consume',
    'inventory.adjust','inventory.transfer','reports.view_branch'
  ])
  union all select 'marketing', unnest(array[
    'dashboard.branch.view','patients.view_basic','services.view','packages.view','reports.view_branch'
  ])
  union all select 'auditor', unnest(array[
    'dashboard.branch.view','patients.view_basic','medical.view_summary','payments.view',
    'reports.view_branch','reports.view_all','reports.export','security.view_audit'
  ])
  union all select 'patient', unnest(array[
    'patients.view_basic','appointments.create','packages.view'
  ])
)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from role_permission_map rpm
join public.roles r on r.key = rpm.role_key
join public.permissions p on p.key = rpm.permission_key
on conflict do nothing;
