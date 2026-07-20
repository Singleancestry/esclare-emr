-- Read-only verification for 202607181320_branch_scoped_staff_context.sql.
select
  pg_get_functiondef('public.current_employee_has_branch(uuid)'::regprocedure)
    like '%starts_at <= pg_catalog.now()%' as branch_helper_rejects_future_assignments,
  pg_get_functiondef('public.current_employee_has_permission(text,uuid)'::regprocedure)
    like '%starts_at <= pg_catalog.now()%' as permission_helper_rejects_future_assignments,
  pg_get_functiondef('public.get_staff_context()'::regprocedure)
    like '%branchPermissions%' as context_preserves_branch_permissions;

select
  not has_function_privilege('anon', 'public.get_staff_context()', 'execute')
    as anonymous_context_access_revoked,
  has_function_privilege('authenticated', 'public.get_staff_context()', 'execute')
    as authenticated_context_access_granted;
