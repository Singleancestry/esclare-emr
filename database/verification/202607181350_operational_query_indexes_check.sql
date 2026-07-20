select
  to_regclass('public.audit_events_created_at_idx') is not null as audit_time_index_exists,
  to_regclass('public.audit_events_patient_created_at_idx') is not null as audit_patient_index_exists,
  to_regclass('public.patients_branch_name_active_idx') is not null as patient_directory_index_exists,
  to_regclass('public.appointment_requests_branch_submitted_active_idx') is not null as request_inbox_index_exists,
  to_regclass('public.employee_branch_roles_active_lookup_idx') is not null as provider_lookup_index_exists,
  to_regclass('public.rooms_active_branch_idx') is not null as room_lookup_index_exists;
