create extension if not exists pgcrypto;
create extension if not exists citext;
create type public.user_status as enum ('active', 'disabled', 'pending');
create type public.employee_status as enum ('active', 'disabled', 'pending');
create type public.trusted_device_status as enum ('trusted', 'revoked', 'expired', 'pending');
create type public.audit_result as enum ('success', 'failure');
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  timezone text not null default 'Asia/Manila',
  phone text,
  address text,
  archived_at timestamptz,
  archived_by uuid,
  archive_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid
);
create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email citext not null unique,
  display_name text not null,
  status public.user_status not null default 'pending',
  email_verified boolean not null default false,
  mfa_required boolean not null default false,
  last_sign_in_at timestamptz,
  archived_at timestamptz,
  archived_by uuid,
  archive_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid
);
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid not null references public.app_users(id),
  employee_number text not null unique,
  legal_name text not null,
  display_name text not null,
  job_title text not null,
  primary_branch_id uuid references public.branches(id),
  status public.employee_status not null default 'pending',
  hired_at date,
  disabled_at timestamptz,
  disabled_by uuid references public.employees(id),
  disabled_reason text,
  archived_at timestamptz,
  archived_by uuid references public.employees(id),
  archive_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint employees_app_user_unique unique (app_user_id)
);
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  privileged boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  primary key (role_id, permission_id)
);
create table public.employee_branch_roles (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id),
  branch_id uuid not null references public.branches(id),
  role_id uuid not null references public.roles(id),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint employee_branch_role_unique unique (employee_id, branch_id, role_id),
  constraint employee_branch_role_valid_range check (ends_at is null or ends_at > starts_at)
);
create table public.trusted_devices (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id),
  branch_id uuid references public.branches(id),
  device_fingerprint text not null,
  device_label text,
  status public.trusted_device_status not null default 'pending',
  trusted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references public.employees(id),
  revoke_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint trusted_devices_unique unique (employee_id, device_fingerprint)
);
create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id),
  name text not null,
  room_type text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint rooms_unique_per_branch unique (branch_id, name)
);
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id),
  name text not null,
  device_type text not null,
  serial_number text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint devices_unique_serial unique (serial_number),
  constraint devices_unique_per_branch unique (branch_id, name)
);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_employee_id uuid references public.employees(id),
  actor_role text,
  branch_id uuid references public.branches(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  patient_id uuid,
  previous_value jsonb,
  new_value jsonb,
  reason text,
  ip inet,
  user_agent text,
  device_id uuid references public.trusted_devices(id),
  session_id text,
  result public.audit_result not null default 'success',
  success boolean not null default true,
  created_at timestamptz not null default now()
);
create index branches_archived_at_idx on public.branches (archived_at);
create index app_users_auth_user_id_idx on public.app_users (auth_user_id);
create index employees_status_idx on public.employees (status);
create index employee_branch_roles_employee_idx on public.employee_branch_roles (employee_id);
create index employee_branch_roles_branch_idx on public.employee_branch_roles (branch_id);
create index audit_events_actor_idx on public.audit_events (actor_employee_id, created_at desc);
create index audit_events_branch_idx on public.audit_events (branch_id, created_at desc);
create index audit_events_entity_idx on public.audit_events (entity_type, entity_id);
create trigger branches_set_updated_at
before update on public.branches
for each row execute function public.set_updated_at();
create trigger app_users_set_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();
create trigger employees_set_updated_at
before update on public.employees
for each row execute function public.set_updated_at();
create trigger roles_set_updated_at
before update on public.roles
for each row execute function public.set_updated_at();
create trigger permissions_set_updated_at
before update on public.permissions
for each row execute function public.set_updated_at();
create trigger employee_branch_roles_set_updated_at
before update on public.employee_branch_roles
for each row execute function public.set_updated_at();
create trigger trusted_devices_set_updated_at
before update on public.trusted_devices
for each row execute function public.set_updated_at();
create trigger rooms_set_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();
create trigger devices_set_updated_at
before update on public.devices
for each row execute function public.set_updated_at();
create or replace function public.prevent_audit_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_events are immutable';
end;
$$;
create trigger audit_events_prevent_update
before update on public.audit_events
for each row execute function public.prevent_audit_event_mutation();
create trigger audit_events_prevent_delete
before delete on public.audit_events
for each row execute function public.prevent_audit_event_mutation();
