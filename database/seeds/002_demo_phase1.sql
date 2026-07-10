insert into public.branches (id, code, name, phone, address)
values
  ('00000000-0000-4000-8000-000000000101', 'NAGA', 'ESCLARE Naga', '+63 900 000 0101', 'Fictional Clinic Avenue, Naga City'),
  ('00000000-0000-4000-8000-000000000102', 'DAET', 'ESCLARE Daet', '+63 900 000 0102', 'Fictional Wellness Street, Daet')
on conflict (code) do update set
  name = excluded.name,
  phone = excluded.phone,
  address = excluded.address;

insert into public.app_users (id, auth_user_id, email, display_name, status, email_verified, mfa_required)
values
  ('00000000-0000-4000-8000-000000000001', null, 'owner.demo@esclare.local', 'Demo Owner', 'active', true, true),
  ('00000000-0000-4000-8000-000000000002', null, 'reception.naga@esclare.local', 'Rina Reception', 'active', true, false),
  ('00000000-0000-4000-8000-000000000003', null, 'cashier.daet@esclare.local', 'Carmen Cashier', 'active', true, false),
  ('00000000-0000-4000-8000-000000000004', null, 'aesthetician.naga@esclare.local', 'Aly Aesthetician', 'active', true, false),
  ('00000000-0000-4000-8000-000000000005', null, 'doctor.demo@esclare.local', 'Dr. Mira Santos', 'active', true, true),
  ('00000000-0000-4000-8000-000000000006', null, 'auditor.demo@esclare.local', 'Alden Auditor', 'active', true, true)
on conflict (email) do update set
  display_name = excluded.display_name,
  status = excluded.status,
  email_verified = excluded.email_verified,
  mfa_required = excluded.mfa_required;

insert into public.employees (id, app_user_id, employee_number, legal_name, display_name, job_title, primary_branch_id, status, hired_at)
values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000001', 'ESC-0001', 'Demo Owner', 'Demo Owner', 'Owner', '00000000-0000-4000-8000-000000000101', 'active', '2025-01-01'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000002', 'ESC-0002', 'Rina Reception', 'Rina Reception', 'Receptionist', '00000000-0000-4000-8000-000000000101', 'active', '2025-02-01'),
  ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000003', 'ESC-0003', 'Carmen Cashier', 'Carmen Cashier', 'Cashier', '00000000-0000-4000-8000-000000000102', 'active', '2025-03-01'),
  ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000004', 'ESC-0004', 'Aly Aesthetician', 'Aly Aesthetician', 'Aesthetician', '00000000-0000-4000-8000-000000000101', 'active', '2025-04-01'),
  ('00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000005', 'ESC-0005', 'Mira Santos', 'Dr. Mira Santos', 'Doctor', '00000000-0000-4000-8000-000000000101', 'active', '2025-05-01'),
  ('00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000006', 'ESC-0006', 'Alden Auditor', 'Alden Auditor', 'Auditor', '00000000-0000-4000-8000-000000000101', 'active', '2025-06-01')
on conflict (employee_number) do update set
  display_name = excluded.display_name,
  job_title = excluded.job_title,
  status = excluded.status;

with assignments(employee_id, branch_id, role_key) as (
  values
    ('00000000-0000-4000-8000-000000000201'::uuid, '00000000-0000-4000-8000-000000000101'::uuid, 'owner'),
    ('00000000-0000-4000-8000-000000000201'::uuid, '00000000-0000-4000-8000-000000000102'::uuid, 'owner'),
    ('00000000-0000-4000-8000-000000000202'::uuid, '00000000-0000-4000-8000-000000000101'::uuid, 'receptionist'),
    ('00000000-0000-4000-8000-000000000203'::uuid, '00000000-0000-4000-8000-000000000102'::uuid, 'cashier'),
    ('00000000-0000-4000-8000-000000000204'::uuid, '00000000-0000-4000-8000-000000000101'::uuid, 'aesthetician'),
    ('00000000-0000-4000-8000-000000000205'::uuid, '00000000-0000-4000-8000-000000000101'::uuid, 'doctor'),
    ('00000000-0000-4000-8000-000000000205'::uuid, '00000000-0000-4000-8000-000000000102'::uuid, 'doctor'),
    ('00000000-0000-4000-8000-000000000206'::uuid, '00000000-0000-4000-8000-000000000101'::uuid, 'auditor'),
    ('00000000-0000-4000-8000-000000000206'::uuid, '00000000-0000-4000-8000-000000000102'::uuid, 'auditor')
)
insert into public.employee_branch_roles (employee_id, branch_id, role_id)
select a.employee_id, a.branch_id, r.id
from assignments a
join public.roles r on r.key = a.role_key
on conflict do nothing;

insert into public.rooms (branch_id, name, room_type)
values
  ('00000000-0000-4000-8000-000000000101', 'Naga Treatment Room 1', 'treatment'),
  ('00000000-0000-4000-8000-000000000101', 'Naga Doctor Room', 'doctor'),
  ('00000000-0000-4000-8000-000000000102', 'Daet Treatment Room 1', 'treatment'),
  ('00000000-0000-4000-8000-000000000102', 'Daet Facial Room', 'facial')
on conflict (branch_id, name) do nothing;

insert into public.devices (branch_id, name, device_type, serial_number)
values
  ('00000000-0000-4000-8000-000000000101', 'Naga 4D Diode Demo Unit', '4d_diode', 'DEMO-DIODE-NAGA-001'),
  ('00000000-0000-4000-8000-000000000101', 'Naga Pico Demo Unit', 'pico_laser', 'DEMO-PICO-NAGA-001'),
  ('00000000-0000-4000-8000-000000000102', 'Daet 4D Diode Demo Unit', '4d_diode', 'DEMO-DIODE-DAET-001'),
  ('00000000-0000-4000-8000-000000000102', 'Daet HIFU Demo Unit', 'hifu', 'DEMO-HIFU-DAET-001')
on conflict (serial_number) do nothing;

insert into public.audit_events (
  actor_employee_id,
  actor_role,
  branch_id,
  action,
  entity_type,
  entity_id,
  reason,
  result,
  success
)
values (
  '00000000-0000-4000-8000-000000000201',
  'owner',
  '00000000-0000-4000-8000-000000000101',
  'seed.phase1.created',
  'system',
  null,
  'Fictional development seed data',
  'success',
  true
);
