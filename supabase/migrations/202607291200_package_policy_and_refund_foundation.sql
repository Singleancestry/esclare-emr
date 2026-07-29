-- PREVIEW PROPOSAL ONLY. Do not apply to production without owner approval and a verified backup.

create table public.package_policy_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  effective_at timestamptz not null,
  policy_title text not null,
  policy_body jsonb not null check (jsonb_typeof(policy_body) = 'object'),
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  legal_review_status text not null default 'pending'
    check (legal_review_status in ('pending', 'approved', 'rejected')),
  legal_reviewed_at timestamptz,
  legal_reviewer_reference text,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.employees(id),
  check (
    (legal_review_status = 'approved' and legal_reviewed_at is not null)
    or legal_review_status <> 'approved'
  )
);

comment on table public.package_policy_versions is
  'Immutable package terms versions. Corrections require a new version; accepted history is never overwritten.';

create table public.patient_packages (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id),
  patient_id uuid not null references public.patients(id),
  policy_version_id uuid not null references public.package_policy_versions(id),
  package_name text not null,
  amount_paid numeric(12,2) not null check (amount_paid >= 0),
  sessions_purchased integer not null check (sessions_purchased > 0),
  regular_price_per_session numeric(12,2) not null check (regular_price_per_session >= 0),
  purchased_at timestamptz not null,
  valid_from date not null,
  expires_on date not null check (expires_on >= valid_from),
  cancellation_notice_hours integer not null check (cancellation_notice_hours >= 0),
  no_show_rule text not null,
  late_cancellation_rule text not null,
  rescheduling_fee numeric(12,2) check (rescheduling_fee is null or rescheduling_fee >= 0),
  status text not null default 'active'
    check (status in ('active', 'frozen', 'completed', 'expired', 'cancelled')),
  archived_at timestamptz,
  archived_by uuid references public.employees(id),
  archive_reason text,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.employees(id),
  updated_at timestamptz not null default now(),
  unique (id, branch_id),
  unique (id, branch_id, patient_id, policy_version_id),
  check (
    (archived_at is null and archived_by is null and archive_reason is null)
    or (archived_at is not null and archived_by is not null and length(trim(archive_reason)) >= 5)
  ),
  foreign key (patient_id, branch_id)
    references public.patient_branch_links(patient_id, branch_id)
);

create table public.package_policy_acceptances (
  id uuid primary key default gen_random_uuid(),
  patient_package_id uuid not null,
  policy_version_id uuid not null,
  patient_id uuid not null,
  branch_id uuid not null references public.branches(id),
  package_snapshot jsonb not null check (
    jsonb_typeof(package_snapshot) = 'object'
    and package_snapshot ?& array[
      'package_name', 'package_price', 'sessions', 'regular_price_per_session',
      'validity_period', 'branch', 'booking_conditions'
    ]
  ),
  accepted_at timestamptz not null,
  acceptance_method text not null
    check (acceptance_method in ('electronic', 'paper_signature', 'staff_witnessed')),
  acknowledgement_text text not null,
  signature_storage_path text,
  staff_witness_id uuid references public.employees(id),
  lawful_ip_hash text,
  approved_exception jsonb,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.employees(id),
  unique (patient_package_id, policy_version_id, accepted_at),
  foreign key (patient_package_id, branch_id, patient_id, policy_version_id)
    references public.patient_packages(id, branch_id, patient_id, policy_version_id)
);

comment on table public.package_policy_acceptances is
  'Append-only acceptance evidence. package_snapshot must preserve the disclosed package facts.';

create table public.package_validity_changes (
  id uuid primary key default gen_random_uuid(),
  patient_package_id uuid not null,
  branch_id uuid not null references public.branches(id),
  previous_expiry_date date not null,
  new_expiry_date date not null,
  reason text not null check (length(trim(reason)) >= 5),
  approved_at timestamptz not null,
  approved_by uuid not null references public.employees(id),
  internal_notes text,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.employees(id),
  check (new_expiry_date >= previous_expiry_date),
  foreign key (patient_package_id, branch_id)
    references public.patient_packages(id, branch_id)
);

create table public.package_refund_requests (
  id uuid primary key default gen_random_uuid(),
  patient_package_id uuid not null,
  branch_id uuid not null references public.branches(id),
  request_reason text not null check (length(trim(request_reason)) >= 5),
  clinic_cause_claimed boolean not null default false,
  status text not null default 'requested'
    check (status in ('requested', 'under_review', 'approved', 'partially_approved', 'declined', 'cancelled')),
  management_reason text,
  decided_at timestamptz,
  decided_by uuid references public.employees(id),
  created_at timestamptz not null default now(),
  created_by uuid not null references public.employees(id),
  updated_at timestamptz not null default now(),
  unique (id, branch_id),
  check (
    (status in ('requested', 'under_review', 'cancelled'))
    or (decided_at is not null and decided_by is not null and length(trim(management_reason)) >= 5)
  ),
  foreign key (patient_package_id, branch_id)
    references public.patient_packages(id, branch_id)
);

create table public.package_refund_calculations (
  id uuid primary key default gen_random_uuid(),
  refund_request_id uuid not null,
  branch_id uuid not null references public.branches(id),
  amount_paid numeric(12,2) not null check (amount_paid >= 0),
  regular_price_per_session numeric(12,2) not null check (regular_price_per_session >= 0),
  sessions_purchased integer not null check (sessions_purchased > 0),
  sessions_used integer not null check (sessions_used >= 0 and sessions_used <= sessions_purchased),
  used_session_value numeric(12,2) generated always as (regular_price_per_session * sessions_used) stored,
  promotional_benefit_value numeric(12,2) not null default 0 check (promotional_benefit_value >= 0),
  lawful_disclosed_deductions numeric(12,2) not null default 0 check (lawful_disclosed_deductions >= 0),
  preliminary_refund numeric(12,2) generated always as (
    greatest(
      0,
      least(
        amount_paid,
        amount_paid - (regular_price_per_session * sessions_used)
          - promotional_benefit_value - lawful_disclosed_deductions
      )
    )
  ) stored,
  final_approved_refund numeric(12,2)
    check (final_approved_refund is null or final_approved_refund >= 0),
  supporting_notes text not null check (length(trim(supporting_notes)) >= 5),
  calculated_at timestamptz not null default now(),
  calculated_by uuid not null references public.employees(id),
  approved_at timestamptz,
  approved_by uuid references public.employees(id),
  check (final_approved_refund is null or final_approved_refund <= preliminary_refund),
  check (
    (final_approved_refund is null and approved_at is null and approved_by is null)
    or (final_approved_refund is not null and approved_at is not null and approved_by is not null)
  ),
  foreign key (refund_request_id, branch_id)
    references public.package_refund_requests(id, branch_id)
);

comment on table public.package_refund_calculations is
  'Append-only administrative calculations. A row does not issue or automatically approve a refund.';

create table public.package_alternative_remedies (
  id uuid primary key default gen_random_uuid(),
  refund_request_id uuid not null,
  branch_id uuid not null references public.branches(id),
  remedy_type text not null
    check (remedy_type in ('reschedule', 'freeze', 'extend', 'transfer', 'convert', 'replace')),
  description text not null check (length(trim(description)) >= 5),
  value_amount numeric(12,2) check (value_amount is null or value_amount >= 0),
  status text not null default 'proposed'
    check (status in ('proposed', 'approved', 'declined', 'accepted', 'completed')),
  approved_at timestamptz,
  approved_by uuid references public.employees(id),
  created_at timestamptz not null default now(),
  created_by uuid not null references public.employees(id),
  foreign key (refund_request_id, branch_id)
    references public.package_refund_requests(id, branch_id)
);

create index patient_packages_branch_patient_idx
  on public.patient_packages (branch_id, patient_id, status);
create index package_policy_acceptances_package_idx
  on public.package_policy_acceptances (patient_package_id, accepted_at desc);
create index package_validity_changes_package_idx
  on public.package_validity_changes (patient_package_id, created_at desc);
create index package_refund_requests_package_idx
  on public.package_refund_requests (patient_package_id, status, created_at desc);
create index package_refund_calculations_request_idx
  on public.package_refund_calculations (refund_request_id, calculated_at desc);
create index package_alternative_remedies_request_idx
  on public.package_alternative_remedies (refund_request_id, created_at desc);

alter table public.package_policy_versions enable row level security;
alter table public.patient_packages enable row level security;
alter table public.package_policy_acceptances enable row level security;
alter table public.package_validity_changes enable row level security;
alter table public.package_refund_requests enable row level security;
alter table public.package_refund_calculations enable row level security;
alter table public.package_alternative_remedies enable row level security;

create policy package_policy_versions_select_authorized
on public.package_policy_versions for select to authenticated
using (public.current_employee_has_permission('packages.view'));

create policy package_policy_versions_insert_authorized
on public.package_policy_versions for insert to authenticated
with check (
  created_by = public.current_employee_id()
  and public.current_employee_has_permission('prices.approve')
);

create policy patient_packages_select_branch
on public.patient_packages for select to authenticated
using (public.current_employee_has_permission('packages.view', branch_id));

create policy patient_packages_insert_branch
on public.patient_packages for insert to authenticated
with check (
  created_by = public.current_employee_id()
  and public.current_employee_has_permission('packages.sell', branch_id)
);

create policy patient_packages_update_branch
on public.patient_packages for update to authenticated
using (public.current_employee_has_permission('packages.adjust_session', branch_id))
with check (public.current_employee_has_permission('packages.adjust_session', branch_id));

create policy package_policy_acceptances_select_branch
on public.package_policy_acceptances for select to authenticated
using (public.current_employee_has_permission('packages.view', branch_id));

create policy package_policy_acceptances_insert_branch
on public.package_policy_acceptances for insert to authenticated
with check (
  created_by = public.current_employee_id()
  and public.current_employee_has_permission('packages.sell', branch_id)
);

create policy package_validity_changes_select_branch
on public.package_validity_changes for select to authenticated
using (public.current_employee_has_permission('packages.view', branch_id));

create policy package_validity_changes_insert_branch
on public.package_validity_changes for insert to authenticated
with check (
  created_by = public.current_employee_id()
  and approved_by = public.current_employee_id()
  and public.current_employee_has_permission('packages.adjust_session', branch_id)
);

create policy package_refund_requests_select_branch
on public.package_refund_requests for select to authenticated
using (public.current_employee_has_permission('payments.view', branch_id));

create policy package_refund_requests_insert_branch
on public.package_refund_requests for insert to authenticated
with check (
  created_by = public.current_employee_id()
  and public.current_employee_has_permission('payments.refund_request', branch_id)
);

create policy package_refund_requests_update_approval
on public.package_refund_requests for update to authenticated
using (public.current_employee_has_permission('payments.refund_approve', branch_id))
with check (public.current_employee_has_permission('payments.refund_approve', branch_id));

create policy package_refund_calculations_select_branch
on public.package_refund_calculations for select to authenticated
using (public.current_employee_has_permission('payments.view', branch_id));

create policy package_refund_calculations_insert_approval
on public.package_refund_calculations for insert to authenticated
with check (
  calculated_by = public.current_employee_id()
  and public.current_employee_has_permission('payments.refund_approve', branch_id)
);

create policy package_alternative_remedies_select_branch
on public.package_alternative_remedies for select to authenticated
using (public.current_employee_has_permission('payments.view', branch_id));

create policy package_alternative_remedies_insert_approval
on public.package_alternative_remedies for insert to authenticated
with check (
  created_by = public.current_employee_id()
  and public.current_employee_has_permission('payments.refund_approve', branch_id)
);

revoke all privileges on public.package_policy_versions from anon, authenticated;
revoke all privileges on public.patient_packages from anon, authenticated;
revoke all privileges on public.package_policy_acceptances from anon, authenticated;
revoke all privileges on public.package_validity_changes from anon, authenticated;
revoke all privileges on public.package_refund_requests from anon, authenticated;
revoke all privileges on public.package_refund_calculations from anon, authenticated;
revoke all privileges on public.package_alternative_remedies from anon, authenticated;

grant select, insert on public.package_policy_versions to authenticated;
grant select, insert on public.patient_packages to authenticated;
grant update (status, archived_at, archived_by, archive_reason, updated_at)
  on public.patient_packages to authenticated;
grant select, insert on public.package_policy_acceptances to authenticated;
grant select, insert on public.package_validity_changes to authenticated;
grant select, insert on public.package_refund_requests to authenticated;
grant update (status, management_reason, decided_at, decided_by, updated_at)
  on public.package_refund_requests to authenticated;
grant select, insert on public.package_refund_calculations to authenticated;
grant select, insert on public.package_alternative_remedies to authenticated;

grant all privileges on public.package_policy_versions to service_role;
grant all privileges on public.patient_packages to service_role;
grant all privileges on public.package_policy_acceptances to service_role;
grant all privileges on public.package_validity_changes to service_role;
grant all privileges on public.package_refund_requests to service_role;
grant all privileges on public.package_refund_calculations to service_role;
grant all privileges on public.package_alternative_remedies to service_role;
