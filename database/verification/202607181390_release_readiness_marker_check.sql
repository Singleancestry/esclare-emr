select
  has_function_privilege('service_role', 'public.get_release_readiness()', 'execute')
    as service_can_read_release_marker,
  not has_function_privilege('anon', 'public.get_release_readiness()', 'execute')
    as anonymous_cannot_read_release_marker,
  not has_function_privilege('authenticated', 'public.get_release_readiness()', 'execute')
    as authenticated_cannot_read_release_marker,
  (public.get_release_readiness() ->> 'ready')::boolean as required_controls_are_present;
