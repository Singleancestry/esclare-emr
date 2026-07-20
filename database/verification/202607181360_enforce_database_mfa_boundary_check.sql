select
  position(
    'current_employee_mfa_satisfied' in
    pg_get_functiondef('public.current_employee_has_permission(text,uuid)'::regprocedure)
  ) > 0 as permission_helper_requires_mfa,
  position(
    'current_employee_mfa_satisfied' in
    pg_get_functiondef('public.current_employee_has_branch(uuid)'::regprocedure)
  ) > 0 as branch_helper_requires_mfa,
  position(
    'aal2' in pg_get_functiondef('public.current_employee_mfa_satisfied()'::regprocedure)
  ) > 0 as mfa_helper_requires_aal2,
  position(
    'current_employee_mfa_satisfied' in
    pg_get_functiondef('public.get_staff_context()'::regprocedure)
  ) > 0 as staff_context_requires_mfa,
  not has_function_privilege('authenticated', 'public.get_staff_context_unchecked()', 'execute')
    as authenticated_cannot_bypass_staff_context_mfa,
  not has_function_privilege('anon', 'public.current_employee_mfa_satisfied()', 'execute')
    as anonymous_cannot_execute_mfa_helper,
  has_function_privilege('authenticated', 'public.current_employee_mfa_satisfied()', 'execute')
    as authenticated_can_execute_mfa_helper;
