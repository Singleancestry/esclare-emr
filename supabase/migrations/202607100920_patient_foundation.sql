create type public.patient_sex_at_birth as enum ('female', 'male', 'intersex', 'prefer_not_to_say');
create type public.patient_contact_method as enum ('sms', 'call', 'email', 'viber', 'messenger');
create type public.clinical_alert_level as enum (
  'none',
  'informational',
  'caution',
  'doctor_review_required',
  'treatment_blocked',
  'emergency'
);
create type public.pregnancy_status as enum ('not_applicable', 'no', 'yes', 'unknown');
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_number text not null unique,
  home_branch_id uuid not null references public.branches(id),
  first_name text not null,
  middle_name text,
  last_name text not null,
  preferred_name text,
  date_of_birth date not null,
  sex_at_birth public.patient_sex_at_birth not null,
  gender text,
  civil_status text,
  nationality text not null default 'Filipino',
  profile_photo_path text,
  mobile text not null,
  secondary_mobile text,
  email citext,
  preferred_contact_method public.patient_contact_method not null default 'sms',
  preferred_language text not null default 'English',
  clinical_alert_level public.clinical_alert_level not null default 'none',
  remaining_sessions_demo integer not null default 0,
  outstanding_balance_demo numeric(12, 2) not null default 0,
  loyalty_points integer not null default 0,
  last_visit_at timestamptz,
  next_appointment_at timestamptz,
  duplicate_of uuid references public.patients(id),
  archived_at timestamptz,
  archived_by uuid references public.employees(id),
  archive_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint patients_mobile_format check (mobile ~ '^(\+?63|0)9[0-9]{9}$'),
  constraint patients_secondary_mobile_format check (
    secondary_mobile is null or secondary_mobile ~ '^(\+?63|0)9[0-9]{9}$'
  ),
  constraint patients_non_negative_demo_sessions check (remaining_sessions_demo >= 0),
  constraint patients_non_negative_balance check (outstanding_balance_demo >= 0),
  constraint patients_non_negative_loyalty check (loyalty_points >= 0)
);
create table public.patient_branch_links (
  patient_id uuid not null references public.patients(id),
  branch_id uuid not null references public.branches(id),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  primary key (patient_id, branch_id)
);
create table public.patient_addresses (
  patient_id uuid primary key references public.patients(id),
  country text not null default 'Philippines',
  region text,
  province text,
  city_municipality text,
  barangay text,
  street text,
  building text,
  postal_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id)
);
create table public.patient_emergency_contacts (
  patient_id uuid primary key references public.patients(id),
  name text not null,
  relationship text not null,
  mobile text not null,
  secondary_contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint patient_emergency_mobile_format check (mobile ~ '^(\+?63|0)9[0-9]{9}$')
);
create table public.patient_physical_information (
  patient_id uuid primary key references public.patients(id),
  height_cm numeric(5, 2),
  weight_kg numeric(5, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint patient_height_positive check (height_cm is null or height_cm > 0),
  constraint patient_weight_positive check (weight_kg is null or weight_kg > 0)
);
create table public.patient_marketing_preferences (
  patient_id uuid primary key references public.patients(id),
  referral_source text,
  referred_by text,
  campaign text,
  promo_code text,
  sms_marketing_consent boolean not null default false,
  email_marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id)
);
create table public.patient_privacy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id),
  privacy_acknowledged_at timestamptz not null default now(),
  identity_verification_method text not null,
  verified_by text not null,
  branch_id uuid not null references public.branches(id),
  created_at timestamptz not null default now(),
  created_by uuid references public.employees(id)
);
create table public.patient_medical_profiles (
  patient_id uuid primary key references public.patients(id),
  alert_level public.clinical_alert_level not null default 'none',
  alert_reason text,
  allergies text[] not null default '{}',
  current_medications text[] not null default '{}',
  medical_conditions text[] not null default '{}',
  pregnancy_status public.pregnancy_status not null default 'unknown',
  breastfeeding boolean,
  previous_aesthetic_procedures text,
  previous_laser_treatments text,
  skin_conditions text,
  keloid_history boolean,
  photosensitivity boolean,
  bleeding_disorders boolean,
  pacemaker_or_implants boolean,
  diabetes boolean,
  hypertension boolean,
  hormonal_conditions text,
  recent_surgery text,
  recent_sun_exposure boolean,
  recent_isotretinoin boolean,
  other_clinical_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id)
);
create table public.patient_contact_reveals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id),
  revealed_by uuid not null references public.employees(id),
  branch_id uuid not null references public.branches(id),
  reason text not null,
  revealed_fields text[] not null,
  created_at timestamptz not null default now()
);
create index patients_home_branch_idx on public.patients (home_branch_id);
create index patients_name_idx on public.patients (last_name, first_name);
create index patients_mobile_idx on public.patients (mobile);
create index patients_archived_idx on public.patients (archived_at);
create index patient_branch_links_branch_idx on public.patient_branch_links (branch_id);
create index patient_contact_reveals_patient_idx on public.patient_contact_reveals (patient_id, created_at desc);
create trigger patients_set_updated_at
before update on public.patients
for each row execute function public.set_updated_at();
create trigger patient_addresses_set_updated_at
before update on public.patient_addresses
for each row execute function public.set_updated_at();
create trigger patient_emergency_contacts_set_updated_at
before update on public.patient_emergency_contacts
for each row execute function public.set_updated_at();
create trigger patient_physical_information_set_updated_at
before update on public.patient_physical_information
for each row execute function public.set_updated_at();
create trigger patient_marketing_preferences_set_updated_at
before update on public.patient_marketing_preferences
for each row execute function public.set_updated_at();
create trigger patient_medical_profiles_set_updated_at
before update on public.patient_medical_profiles
for each row execute function public.set_updated_at();
alter table public.patients enable row level security;
alter table public.patient_branch_links enable row level security;
alter table public.patient_addresses enable row level security;
alter table public.patient_emergency_contacts enable row level security;
alter table public.patient_physical_information enable row level security;
alter table public.patient_marketing_preferences enable row level security;
alter table public.patient_privacy_acknowledgements enable row level security;
alter table public.patient_medical_profiles enable row level security;
alter table public.patient_contact_reveals enable row level security;
create or replace function public.current_employee_can_access_patient(target_patient_id uuid, permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.patient_branch_links pbl
    where pbl.patient_id = target_patient_id
      and public.current_employee_has_permission(permission_key, pbl.branch_id)
  )
$$;
create policy patients_select_basic
on public.patients
for select
to authenticated
using (public.current_employee_can_access_patient(id, 'patients.view_basic'));
create policy patients_insert_authorized
on public.patients
for insert
to authenticated
with check (public.current_employee_has_permission('patients.create', home_branch_id));
create policy patients_update_authorized
on public.patients
for update
to authenticated
using (public.current_employee_can_access_patient(id, 'patients.update_basic'))
with check (public.current_employee_can_access_patient(id, 'patients.update_basic'));
create policy patient_branch_links_select
on public.patient_branch_links
for select
to authenticated
using (public.current_employee_has_permission('patients.view_basic', branch_id));
create policy patient_branch_links_insert
on public.patient_branch_links
for insert
to authenticated
with check (public.current_employee_has_permission('patients.create', branch_id));
create policy patient_addresses_select
on public.patient_addresses
for select
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.view_basic'));
create policy patient_addresses_write
on public.patient_addresses
for all
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'))
with check (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'));
create policy patient_emergency_contacts_select
on public.patient_emergency_contacts
for select
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.view_basic'));
create policy patient_emergency_contacts_write
on public.patient_emergency_contacts
for all
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'))
with check (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'));
create policy patient_physical_information_select
on public.patient_physical_information
for select
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.view_basic'));
create policy patient_physical_information_write
on public.patient_physical_information
for all
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'))
with check (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'));
create policy patient_marketing_preferences_select
on public.patient_marketing_preferences
for select
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.view_basic'));
create policy patient_marketing_preferences_write
on public.patient_marketing_preferences
for all
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'))
with check (public.current_employee_can_access_patient(patient_id, 'patients.update_basic'));
create policy patient_privacy_acknowledgements_select
on public.patient_privacy_acknowledgements
for select
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'patients.view_basic'));
create policy patient_privacy_acknowledgements_insert
on public.patient_privacy_acknowledgements
for insert
to authenticated
with check (public.current_employee_has_permission('patients.create', branch_id));
create policy patient_medical_profiles_summary_select
on public.patient_medical_profiles
for select
to authenticated
using (
  public.current_employee_can_access_patient(patient_id, 'medical.view_summary')
  or public.current_employee_can_access_patient(patient_id, 'medical.view_full')
);
create policy patient_medical_profiles_write
on public.patient_medical_profiles
for all
to authenticated
using (public.current_employee_can_access_patient(patient_id, 'medical.update'))
with check (public.current_employee_can_access_patient(patient_id, 'medical.update'));
create policy patient_contact_reveals_insert
on public.patient_contact_reveals
for insert
to authenticated
with check (
  revealed_by = public.current_employee_id()
  and public.current_employee_has_permission('patients.reveal_contact', branch_id)
);
create policy patient_contact_reveals_select_security
on public.patient_contact_reveals
for select
to authenticated
using (
  public.current_employee_has_permission('security.view_audit', branch_id)
  or revealed_by = public.current_employee_id()
);
