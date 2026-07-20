create type public.appointment_request_status as enum (
  'pending',
  'contacted',
  'confirmed',
  'declined',
  'cancelled',
  'archived'
);
create table public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique,
  branch_id uuid not null references public.branches(id),
  full_name text not null,
  service_id uuid references public.services(id),
  requested_service text,
  preferred_date date,
  preferred_time time,
  status public.appointment_request_status not null default 'pending',
  status_reason text,
  source text not null default 'website',
  submitted_at timestamptz not null default now(),
  handled_at timestamptz,
  handled_by uuid references public.employees(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  archived_at timestamptz,
  archived_by uuid references public.employees(id),
  archive_reason text,
  constraint appointment_request_full_name_length check (char_length(trim(full_name)) between 2 and 120),
  constraint appointment_request_source_allowed check (source in ('website', 'staff', 'facebook', 'phone', 'sms')),
  constraint appointment_request_archive_complete check (
    archived_at is null
    or (status = 'archived' and archived_by is not null and char_length(trim(archive_reason)) >= 3)
  )
);
create index appointment_requests_branch_status_idx
on public.appointment_requests (branch_id, status, submitted_at desc)
where archived_at is null;
create index appointment_requests_service_idx
on public.appointment_requests (service_id, submitted_at desc)
where service_id is not null;
create trigger appointment_requests_set_updated_at before update on public.appointment_requests
for each row execute function public.set_updated_at();
alter table public.appointment_requests enable row level security;
create policy appointment_requests_staff_read
on public.appointment_requests
for select
to authenticated
using (public.current_employee_has_permission('appointments.view', branch_id));
create policy appointment_requests_staff_create
on public.appointment_requests
for insert
to authenticated
with check (
  public.current_employee_has_permission('appointments.create', branch_id)
  and created_by = public.current_employee_id()
);
create policy appointment_requests_staff_update
on public.appointment_requests
for update
to authenticated
using (public.current_employee_has_permission('appointments.confirm', branch_id))
with check (public.current_employee_has_permission('appointments.confirm', branch_id));
-- Public submissions pass through the server-only service client. There is intentionally
-- no anonymous table policy and no delete policy for appointment requests.;
