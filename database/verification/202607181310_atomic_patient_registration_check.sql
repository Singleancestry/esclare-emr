-- Read-only verification for 202607181310_atomic_patient_registration.sql.
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
  and p.proname = 'create_patient_atomic';
