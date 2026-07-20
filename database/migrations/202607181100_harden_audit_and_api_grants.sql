-- Sensitive audit events are written only by reviewed server-side application paths.
drop policy if exists audit_events_insert_staff on public.audit_events;
revoke insert on table public.audit_events from authenticated, anon;

-- Public appointment requests use the server-only service client; anonymous SQL writes
-- are intentionally unavailable even though RLS already denied them.
revoke insert, update on table public.appointment_requests from anon, authenticated;

-- Appointment events are authoritative history produced by the server workflow, not a
-- client-writable activity stream.
drop policy if exists appointment_events_staff_insert on public.appointment_events;
revoke insert on table public.appointment_events from authenticated, anon;

-- PostgreSQL grants function execution to PUBLIC by default. Keep RPC and RLS helper
-- execution limited to authenticated application users and the server service role.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.current_employee_id() to authenticated;
grant execute on function public.current_employee_has_branch(uuid) to authenticated;
grant execute on function public.current_employee_has_permission(text, uuid) to authenticated;
grant execute on function public.get_staff_context() to authenticated;
grant execute on function public.current_employee_can_access_patient(uuid, text) to authenticated;
grant execute on all functions in schema public to service_role;

alter default privileges in schema public
revoke execute on functions from public, authenticated;

alter default privileges in schema public
grant execute on functions to service_role;

-- New public tables default to server-only access. A reviewed migration must opt
-- authenticated users into the exact operations it needs.
alter default privileges in schema public
revoke select, insert, update, delete on tables from public, anon, authenticated;

alter default privileges in schema public
grant select, insert, update, delete on tables to service_role;
