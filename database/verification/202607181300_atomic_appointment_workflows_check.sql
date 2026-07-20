-- Read-only verification for 202607181300_atomic_appointment_workflows.sql.
select
  to_regprocedure('public.create_appointment_atomic(uuid,uuid,uuid,uuid,uuid,timestamptz,timestamptz,text,uuid)') is not null
    as atomic_create_function_exists,
  to_regprocedure('public.transition_appointment_atomic(uuid,public.appointment_status,public.appointment_status,text,uuid)') is not null
    as atomic_transition_function_exists;

select
  conname = 'appointments_patient_no_overlap' as patient_overlap_constraint_exists
from pg_constraint
where conrelid = 'public.appointments'::regclass
  and conname = 'appointments_patient_no_overlap';

select
  p.oid::regprocedure::text as function_name,
  p.prosecdef as security_definer,
  p.proconfig @> array['search_path=pg_catalog, public'] as safe_search_path,
  not has_function_privilege('authenticated', p.oid, 'execute') as authenticated_execute_revoked,
  not has_function_privilege('anon', p.oid, 'execute') as anonymous_execute_revoked,
  has_function_privilege('service_role', p.oid, 'execute') as service_role_execute_granted
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('create_appointment_atomic', 'transition_appointment_atomic')
order by p.proname;

select
  not has_table_privilege('authenticated', 'public.appointments', 'insert')
    as authenticated_cannot_bypass_atomic_create,
  not has_table_privilege('authenticated', 'public.appointments', 'update')
    as authenticated_cannot_bypass_atomic_transition,
  not has_table_privilege('authenticated', 'public.appointment_events', 'insert')
    as authenticated_cannot_forge_appointment_events,
  not has_table_privilege('authenticated', 'public.audit_events', 'insert')
    as authenticated_cannot_forge_audit_events;
