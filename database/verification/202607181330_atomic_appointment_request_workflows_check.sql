select
  to_regprocedure('public.create_public_appointment_request_atomic(uuid,text,text,uuid,text,uuid,text,date,time)') is not null
    as atomic_public_request_function_exists,
  to_regprocedure('public.transition_appointment_request_atomic(uuid,public.appointment_request_status,public.appointment_request_status,text,uuid)') is not null
    as atomic_request_transition_function_exists;

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
  and p.proname in ('create_public_appointment_request_atomic', 'transition_appointment_request_atomic')
order by p.proname;
