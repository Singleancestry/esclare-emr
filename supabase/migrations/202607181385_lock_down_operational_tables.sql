-- Pilot scope is enforced through permission-checked server services, never direct client tables.
revoke all on table
  public.appointments,
  public.appointment_events,
  public.appointment_requests,
  public.audit_events,
  public.patient_contact_reveals
from anon, authenticated;

grant select, insert, update, delete on table
  public.appointments,
  public.appointment_events,
  public.appointment_requests,
  public.audit_events,
  public.patient_contact_reveals
to service_role;
