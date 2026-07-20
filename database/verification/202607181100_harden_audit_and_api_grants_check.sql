select
  not has_table_privilege('authenticated', 'public.audit_events', 'insert')
    as authenticated_cannot_insert_audit_events,
  not has_table_privilege('anon', 'public.audit_events', 'insert')
    as anonymous_cannot_insert_audit_events,
  not has_table_privilege('anon', 'public.appointment_requests', 'insert')
    as anonymous_cannot_insert_appointment_requests,
  not has_table_privilege('authenticated', 'public.appointment_requests', 'update')
    as authenticated_cannot_directly_update_appointment_requests,
  not has_table_privilege('authenticated', 'public.appointment_events', 'insert')
    as authenticated_cannot_insert_appointment_events;

select
  p.oid::regprocedure::text as function_name,
  not exists (
    select 1
    from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
    where acl.grantee = 0 and acl.privilege_type = 'EXECUTE'
  ) as public_execute_revoked,
  not has_function_privilege('anon', p.oid, 'execute') as anonymous_execute_revoked,
  has_function_privilege('authenticated', p.oid, 'execute') = (
    p.oid = any(array[
      to_regprocedure('public.current_employee_id()'),
      to_regprocedure('public.current_employee_has_branch(uuid)'),
      to_regprocedure('public.current_employee_has_permission(text,uuid)'),
      to_regprocedure('public.get_staff_context()'),
      to_regprocedure('public.current_employee_can_access_patient(uuid,text)')
    ])
  ) as authenticated_execute_matches_allowlist,
  has_function_privilege('service_role', p.oid, 'execute') as service_role_execute_granted
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.oid::regprocedure::text;
