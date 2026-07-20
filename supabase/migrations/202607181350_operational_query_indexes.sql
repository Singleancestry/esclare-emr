-- Keep append-only audit and branch workspaces responsive as operational data grows.
create index if not exists audit_events_created_at_idx
on public.audit_events (created_at desc);

create index if not exists audit_events_patient_created_at_idx
on public.audit_events (patient_id, created_at desc)
where patient_id is not null;

create index if not exists patients_branch_name_active_idx
on public.patients (home_branch_id, last_name, first_name)
where archived_at is null;

create index if not exists appointment_requests_branch_submitted_active_idx
on public.appointment_requests (branch_id, submitted_at desc)
where archived_at is null;

create index if not exists employee_branch_roles_active_lookup_idx
on public.employee_branch_roles (branch_id, employee_id)
where ends_at is null;

create index if not exists rooms_active_branch_idx
on public.rooms (branch_id, name)
where active;
