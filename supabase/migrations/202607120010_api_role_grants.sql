grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
grant insert on table public.appointment_requests to anon;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
alter default privileges in schema public
grant select, insert, update on tables to authenticated;
alter default privileges in schema public
grant all privileges on tables to service_role;
alter default privileges in schema public
grant usage, select on sequences to authenticated;
alter default privileges in schema public
grant all privileges on sequences to service_role;
alter default privileges in schema public
grant execute on functions to authenticated, service_role;
