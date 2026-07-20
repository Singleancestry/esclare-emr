create or replace function public.get_release_readiness()
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select jsonb_build_object(
    'schemaVersion',
    '202607181390',
    'ready',
    to_regprocedure('public.create_patient_atomic(jsonb,uuid)') is not null
      and to_regprocedure(
        'public.create_appointment_atomic(uuid,uuid,uuid,uuid,uuid,timestamp with time zone,timestamp with time zone,text,uuid)'
      ) is not null
      and to_regprocedure(
        'public.transition_appointment_atomic(uuid,public.appointment_status,public.appointment_status,text,uuid)'
      ) is not null
      and to_regprocedure(
        'public.create_public_appointment_request_atomic(uuid,text,text,uuid,text,uuid,text,date,time without time zone)'
      )
        is not null
      and to_regprocedure(
        'public.transition_appointment_request_atomic(uuid,public.appointment_request_status,public.appointment_request_status,text,uuid)'
      ) is not null
      and to_regprocedure('public.reveal_patient_contact_atomic(uuid,uuid,text,uuid)') is not null
      and to_regprocedure('public.current_employee_mfa_satisfied()') is not null
      and to_regprocedure('public.get_staff_context()') is not null
      and to_regclass('public.appointment_requests_fingerprint_submitted_idx') is not null
      and not has_table_privilege('authenticated', 'public.app_users', 'select')
      and not has_table_privilege('authenticated', 'public.employee_branch_roles', 'update')
      and not has_table_privilege('authenticated', 'public.appointments', 'select')
      and not has_table_privilege('authenticated', 'public.appointment_requests', 'select')
      and not has_table_privilege('authenticated', 'public.audit_events', 'insert')
  )
$$;

revoke execute on function public.get_release_readiness() from public, anon, authenticated;
grant execute on function public.get_release_readiness() to service_role;
