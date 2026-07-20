-- Read-only verification for 202607121200_appointment_scheduling.sql.
-- Run after a verified production backup and after applying the migration.

select
  'appointment_status enum exists' as check_name,
  exists (
    select 1
    from pg_type
    where typnamespace = 'public'::regnamespace
      and typname = 'appointment_status'
  ) as passed;

select
  'appointments table exists' as check_name,
  to_regclass('public.appointments') is not null as passed;

select
  'appointment_events table exists' as check_name,
  to_regclass('public.appointment_events') is not null as passed;

select
  'appointments rls enabled' as check_name,
  relrowsecurity as passed
from pg_class
where oid = 'public.appointments'::regclass;

select
  'appointment_events rls enabled' as check_name,
  relrowsecurity as passed
from pg_class
where oid = 'public.appointment_events'::regclass;

select
  'appointment policies present' as check_name,
  count(*) = 4 as passed,
  array_agg(policyname order by policyname) as policies
from pg_policies
where schemaname = 'public'
  and tablename in ('appointments', 'appointment_events')
  and policyname in (
    'appointments_staff_create',
    'appointments_staff_read',
    'appointments_staff_update',
    'appointment_events_staff_read'
  );

select
  'provider overlap constraint present' as check_name,
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.appointments'::regclass
      and conname = 'appointments_provider_no_overlap'
  ) as passed;

select
  'room overlap constraint present' as check_name,
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.appointments'::regclass
      and conname = 'appointments_room_no_overlap'
  ) as passed;

select
  'appointment events are append-only for authenticated' as check_name,
  not has_table_privilege('authenticated', 'public.appointment_events', 'UPDATE')
    and not has_table_privilege('authenticated', 'public.appointment_events', 'DELETE') as passed;

select
  'existing appointment request table still available' as check_name,
  to_regclass('public.appointment_requests') is not null as passed;
