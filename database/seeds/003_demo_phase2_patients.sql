insert into public.patients (
  id,
  patient_number,
  home_branch_id,
  first_name,
  middle_name,
  last_name,
  preferred_name,
  date_of_birth,
  sex_at_birth,
  nationality,
  mobile,
  email,
  preferred_contact_method,
  preferred_language,
  clinical_alert_level,
  remaining_sessions_demo,
  outstanding_balance_demo,
  loyalty_points,
  last_visit_at,
  next_appointment_at
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'ESC-P-0001',
    '00000000-0000-4000-8000-000000000101',
    'Liana',
    'Reyes',
    'Cruz',
    'Lia',
    '1994-08-14',
    'female',
    'Filipino',
    '09171234567',
    'liana.cruz@example.test',
    'sms',
    'English',
    'caution',
    4,
    0,
    320,
    '2026-07-02 10:30:00+08',
    '2026-07-30 11:00:00+08'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'ESC-P-0002',
    '00000000-0000-4000-8000-000000000102',
    'Paolo',
    null,
    'Villanueva',
    null,
    '1989-03-21',
    'male',
    'Filipino',
    '09181234567',
    'paolo.villanueva@example.test',
    'call',
    'English',
    'doctor_review_required',
    2,
    1850,
    140,
    '2026-06-28 14:00:00+08',
    null
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'ESC-P-0003',
    '00000000-0000-4000-8000-000000000101',
    'Camille',
    'Ong',
    'Dela Paz',
    'Cam',
    '2000-11-09',
    'female',
    'Filipino',
    '+639191234567',
    null,
    'sms',
    'English',
    'informational',
    0,
    0,
    75,
    null,
    '2026-07-15 09:30:00+08'
  )
on conflict (patient_number) do update set
  clinical_alert_level = excluded.clinical_alert_level,
  remaining_sessions_demo = excluded.remaining_sessions_demo,
  outstanding_balance_demo = excluded.outstanding_balance_demo,
  loyalty_points = excluded.loyalty_points;

insert into public.patient_branch_links (patient_id, branch_id, last_seen_at)
select id, home_branch_id, last_visit_at
from public.patients
where patient_number in ('ESC-P-0001', 'ESC-P-0002', 'ESC-P-0003')
on conflict do nothing;

insert into public.patient_addresses (
  patient_id,
  country,
  region,
  province,
  city_municipality,
  barangay,
  street,
  building,
  postal_code
)
values
  ('10000000-0000-4000-8000-000000000001', 'Philippines', 'Bicol Region', 'Camarines Sur', 'Naga City', 'Fictional Barangay', 'Sample Street', 'Unit 2', '4400'),
  ('10000000-0000-4000-8000-000000000002', 'Philippines', 'Bicol Region', 'Camarines Norte', 'Daet', 'Demo Barangay', 'Clinic Road', null, '4600')
on conflict (patient_id) do nothing;

insert into public.patient_emergency_contacts (patient_id, name, relationship, mobile, secondary_contact)
values
  ('10000000-0000-4000-8000-000000000001', 'Mara Cruz', 'Sister', '09175550101', null),
  ('10000000-0000-4000-8000-000000000002', 'Nico Villanueva', 'Brother', '09185550102', 'Home line on file')
on conflict (patient_id) do nothing;

insert into public.patient_physical_information (patient_id, height_cm, weight_kg)
values
  ('10000000-0000-4000-8000-000000000001', 162, 55),
  ('10000000-0000-4000-8000-000000000002', 174, 78)
on conflict (patient_id) do nothing;

insert into public.patient_medical_profiles (
  patient_id,
  alert_level,
  alert_reason,
  allergies,
  current_medications,
  medical_conditions,
  pregnancy_status,
  breastfeeding,
  keloid_history,
  photosensitivity,
  diabetes,
  hypertension,
  recent_sun_exposure,
  other_clinical_notes
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'caution',
    'Reports recent sun exposure.',
    array['Fragrance sensitivity'],
    array['Vitamin C supplement'],
    array['Mild eczema history'],
    'no',
    false,
    false,
    true,
    false,
    false,
    true,
    'Patch test recommended before stronger peels.'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'doctor_review_required',
    'Hypertension noted during intake.',
    '{}',
    array['Maintenance medication on file'],
    array['Hypertension'],
    'not_applicable',
    null,
    false,
    false,
    false,
    true,
    false,
    'Doctor assessment required before energy-based procedures.'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'informational',
    'First visit intake incomplete.',
    '{}',
    '{}',
    '{}',
    'unknown',
    null,
    null,
    null,
    null,
    null,
    null,
    'Complete medical profile before treatment.'
  )
on conflict (patient_id) do nothing;
