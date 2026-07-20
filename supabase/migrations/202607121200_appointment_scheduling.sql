create extension if not exists btree_gist;

create type public.appointment_status as enum (
  'scheduled',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id),
  patient_id uuid not null references public.patients(id),
  service_id uuid references public.services(id),
  provider_employee_id uuid references public.employees(id),
  room_id uuid references public.rooms(id),
  source_request_id uuid unique references public.appointment_requests(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  booking_note text,
  cancellation_reason text,
  cancelled_at timestamptz,
  cancelled_by uuid references public.employees(id),
  checked_in_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references public.employees(id),
  archived_at timestamptz,
  archived_by uuid references public.employees(id),
  archive_reason text,
  constraint appointment_time_order check (ends_at > starts_at),
  constraint appointment_duration check (ends_at <= starts_at + interval '8 hours'),
  constraint appointment_cancellation_complete check (
    status not in ('cancelled', 'no_show')
    or (cancelled_at is not null and cancelled_by is not null and char_length(trim(cancellation_reason)) >= 3)
  ),
  constraint appointment_check_in_complete check (status <> 'checked_in' or checked_in_at is not null),
  constraint appointment_start_complete check (status <> 'in_progress' or started_at is not null),
  constraint appointment_completion_complete check (status <> 'completed' or completed_at is not null)
);

alter table public.appointments add constraint appointments_provider_no_overlap
exclude using gist (
  provider_employee_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (provider_employee_id is not null and status in ('scheduled', 'confirmed', 'checked_in', 'in_progress'));

alter table public.appointments add constraint appointments_room_no_overlap
exclude using gist (
  room_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (room_id is not null and status in ('scheduled', 'confirmed', 'checked_in', 'in_progress'));

create table public.appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id),
  branch_id uuid not null references public.branches(id),
  from_status public.appointment_status,
  to_status public.appointment_status not null,
  reason text,
  occurred_at timestamptz not null default now(),
  actor_employee_id uuid not null references public.employees(id),
  metadata jsonb not null default '{}'::jsonb
);

create index appointments_branch_schedule_idx
on public.appointments (branch_id, starts_at, status)
where archived_at is null;

create index appointments_patient_idx
on public.appointments (patient_id, starts_at desc)
where archived_at is null;

create index appointment_events_appointment_idx
on public.appointment_events (appointment_id, occurred_at desc);

create trigger appointments_set_updated_at before update on public.appointments
for each row execute function public.set_updated_at();

alter table public.appointments enable row level security;
alter table public.appointment_events enable row level security;

create policy appointments_staff_read on public.appointments for select to authenticated
using (public.current_employee_has_permission('appointments.view', branch_id));

create policy appointments_staff_create on public.appointments for insert to authenticated
with check (
  public.current_employee_has_permission('appointments.create', branch_id)
  and created_by = public.current_employee_id()
  and public.current_employee_has_branch(branch_id)
);

create policy appointments_staff_update on public.appointments for update to authenticated
using (public.current_employee_has_permission('appointments.view', branch_id))
with check (
  (status = 'scheduled' and public.current_employee_has_permission('appointments.create', branch_id))
  or (status = 'confirmed' and public.current_employee_has_permission('appointments.confirm', branch_id))
  or (status = 'checked_in' and public.current_employee_has_permission('appointments.check_in', branch_id))
  or (status = 'in_progress' and public.current_employee_has_permission('appointments.start_treatment', branch_id))
  or (status = 'completed' and public.current_employee_has_permission('appointments.complete', branch_id))
  or (status in ('cancelled', 'no_show') and public.current_employee_has_permission('appointments.cancel', branch_id))
);

create policy appointment_events_staff_read on public.appointment_events for select to authenticated
using (public.current_employee_has_permission('appointments.view', branch_id));

create policy appointment_events_staff_insert on public.appointment_events for insert to authenticated
with check (
  actor_employee_id = public.current_employee_id()
  and public.current_employee_has_permission('appointments.view', branch_id)
);

-- No update or delete policies are defined. Appointment history is append-only.

revoke update, delete on public.appointment_events from authenticated;
grant select, insert, update on public.appointments to authenticated;
grant select, insert on public.appointment_events to authenticated;
