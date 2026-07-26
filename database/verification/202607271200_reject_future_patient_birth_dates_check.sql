select
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.patients'::regclass
      and tgname = 'patients_reject_future_birth_date'
      and not tgisinternal
  ) as patient_birth_date_guard_exists,
  pg_get_functiondef('public.reject_future_patient_birth_date()'::regprocedure)
    like '%new.date_of_birth > current_date%'
    as patient_birth_date_guard_rejects_future_dates,
  not has_function_privilege(
    'authenticated',
    'public.reject_future_patient_birth_date()',
    'execute'
  ) as authenticated_cannot_call_birth_date_guard;
