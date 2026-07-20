-- Appointment state, history, and audit records must commit or roll back together.
alter table public.appointments
add constraint appointments_patient_no_overlap
exclude using gist (
  patient_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (status in ('scheduled', 'confirmed', 'checked_in', 'in_progress'));

-- The service-only functions below are the sole mutation boundary.
revoke insert, update, delete on table public.appointments from authenticated, anon;

create or replace function public.create_appointment_atomic(
  p_branch_id uuid,
  p_patient_id uuid,
  p_service_id uuid,
  p_provider_employee_id uuid,
  p_room_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_booking_note text,
  p_actor_employee_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_appointment_id uuid;
  v_actor_role text;
begin
  select r.key
  into v_actor_role
  from public.employees e
  join public.app_users u on u.id = e.app_user_id
  join public.employee_branch_roles ebr on ebr.employee_id = e.id
  join public.roles r on r.id = ebr.role_id
  join public.role_permissions rp on rp.role_id = r.id
  join public.permissions p on p.id = rp.permission_id
  where e.id = p_actor_employee_id
    and e.status = 'active'
    and u.status = 'active'
    and ebr.branch_id = p_branch_id
    and ebr.starts_at <= pg_catalog.now()
    and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
    and p.key = 'appointments.create'
  order by r.privileged desc, ebr.created_at
  limit 1;

  if v_actor_role is null then
    raise exception using errcode = '42501', message = 'appointment actor is not authorized';
  end if;

  if not exists (
    select 1
    from public.patients patient
    join public.patient_branch_links link on link.patient_id = patient.id
    where patient.id = p_patient_id
      and patient.archived_at is null
      and link.branch_id = p_branch_id
  ) then
    raise exception using errcode = '42501', message = 'patient is not available in this branch';
  end if;

  if p_provider_employee_id is not null and not exists (
    select 1
    from public.employees provider
    join public.employee_branch_roles assignment on assignment.employee_id = provider.id
    where provider.id = p_provider_employee_id
      and provider.status = 'active'
      and assignment.branch_id = p_branch_id
      and assignment.starts_at <= pg_catalog.now()
      and (assignment.ends_at is null or assignment.ends_at > pg_catalog.now())
  ) then
    raise exception using errcode = '23514', message = 'provider is not active in this branch';
  end if;

  if p_room_id is not null and not exists (
    select 1
    from public.rooms room
    where room.id = p_room_id
      and room.branch_id = p_branch_id
      and room.active
  ) then
    raise exception using errcode = '23514', message = 'room is not active in this branch';
  end if;

  if p_service_id is not null and not exists (
    select 1
    from public.services service
    join public.branch_services availability on availability.service_id = service.id
    where service.id = p_service_id
      and service.archived_at is null
      and availability.branch_id = p_branch_id
      and availability.is_available
  ) then
    raise exception using errcode = '23514', message = 'service is not available in this branch';
  end if;

  if exists (
    select 1 from public.services service
    where service.id = p_service_id and service.doctor_required
  ) and not exists (
    select 1
    from public.employee_branch_roles assignment
    join public.roles role on role.id = assignment.role_id
    where assignment.employee_id = p_provider_employee_id
      and assignment.branch_id = p_branch_id
      and assignment.starts_at <= pg_catalog.now()
      and (assignment.ends_at is null or assignment.ends_at > pg_catalog.now())
      and role.key = 'doctor'
  ) then
    raise exception using errcode = '23514', message = 'this service requires an active doctor';
  end if;

  insert into public.appointments (
    branch_id,
    patient_id,
    service_id,
    provider_employee_id,
    room_id,
    starts_at,
    ends_at,
    booking_note,
    status,
    created_by
  ) values (
    p_branch_id,
    p_patient_id,
    p_service_id,
    p_provider_employee_id,
    p_room_id,
    p_starts_at,
    p_ends_at,
    nullif(pg_catalog.btrim(p_booking_note), ''),
    'scheduled',
    p_actor_employee_id
  )
  returning id into v_appointment_id;

  insert into public.appointment_events (
    appointment_id,
    branch_id,
    to_status,
    reason,
    actor_employee_id
  ) values (
    v_appointment_id,
    p_branch_id,
    'scheduled',
    'Appointment created',
    p_actor_employee_id
  );

  insert into public.audit_events (
    actor_employee_id,
    actor_role,
    branch_id,
    action,
    entity_type,
    entity_id,
    patient_id,
    new_value,
    reason,
    result,
    success
  ) values (
    p_actor_employee_id,
    v_actor_role,
    p_branch_id,
    'appointment.create',
    'appointments',
    v_appointment_id,
    p_patient_id,
    pg_catalog.jsonb_build_object('status', 'scheduled', 'startsAt', p_starts_at, 'endsAt', p_ends_at),
    'Scheduled by staff',
    'success',
    true
  );

  return v_appointment_id;
end;
$$;

create or replace function public.transition_appointment_atomic(
  p_appointment_id uuid,
  p_expected_status public.appointment_status,
  p_new_status public.appointment_status,
  p_reason text,
  p_actor_employee_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_branch_id uuid;
  v_patient_id uuid;
  v_current_status public.appointment_status;
  v_required_permission text;
  v_actor_role text;
  v_now timestamptz := pg_catalog.now();
begin
  select branch_id, patient_id, status
  into v_branch_id, v_patient_id, v_current_status
  from public.appointments
  where id = p_appointment_id
    and archived_at is null
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'appointment is not available';
  end if;

  if v_current_status <> p_expected_status then
    raise exception using errcode = '40001', message = 'appointment changed concurrently';
  end if;

  if not (
    (v_current_status = 'scheduled' and p_new_status in ('confirmed', 'checked_in', 'cancelled', 'no_show'))
    or (v_current_status = 'confirmed' and p_new_status in ('checked_in', 'cancelled', 'no_show'))
    or (v_current_status = 'checked_in' and p_new_status in ('in_progress', 'cancelled'))
    or (v_current_status = 'in_progress' and p_new_status in ('completed', 'cancelled'))
  ) then
    raise exception using errcode = '23514', message = 'invalid appointment transition';
  end if;

  if p_new_status in ('cancelled', 'no_show') and pg_catalog.char_length(pg_catalog.btrim(coalesce(p_reason, ''))) < 3 then
    raise exception using errcode = '23514', message = 'cancellation or no-show reason is required';
  end if;

  v_required_permission := case p_new_status
    when 'confirmed' then 'appointments.confirm'
    when 'checked_in' then 'appointments.check_in'
    when 'in_progress' then 'appointments.start_treatment'
    when 'completed' then 'appointments.complete'
    when 'cancelled' then 'appointments.cancel'
    when 'no_show' then 'appointments.cancel'
    else null
  end;

  select r.key
  into v_actor_role
  from public.employees e
  join public.app_users u on u.id = e.app_user_id
  join public.employee_branch_roles ebr on ebr.employee_id = e.id
  join public.roles r on r.id = ebr.role_id
  join public.role_permissions rp on rp.role_id = r.id
  join public.permissions p on p.id = rp.permission_id
  where e.id = p_actor_employee_id
    and e.status = 'active'
    and u.status = 'active'
    and ebr.branch_id = v_branch_id
    and ebr.starts_at <= v_now
    and (ebr.ends_at is null or ebr.ends_at > v_now)
    and p.key = v_required_permission
  order by r.privileged desc, ebr.created_at
  limit 1;

  if v_actor_role is null then
    raise exception using errcode = '42501', message = 'appointment actor is not authorized';
  end if;

  update public.appointments
  set
    status = p_new_status,
    checked_in_at = case when p_new_status = 'checked_in' then v_now else checked_in_at end,
    started_at = case when p_new_status = 'in_progress' then v_now else started_at end,
    completed_at = case when p_new_status = 'completed' then v_now else completed_at end,
    cancelled_at = case when p_new_status in ('cancelled', 'no_show') then v_now else cancelled_at end,
    cancelled_by = case when p_new_status in ('cancelled', 'no_show') then p_actor_employee_id else cancelled_by end,
    cancellation_reason = case
      when p_new_status in ('cancelled', 'no_show') then pg_catalog.btrim(p_reason)
      else cancellation_reason
    end
  where id = p_appointment_id;

  insert into public.appointment_events (
    appointment_id,
    branch_id,
    from_status,
    to_status,
    reason,
    actor_employee_id
  ) values (
    p_appointment_id,
    v_branch_id,
    v_current_status,
    p_new_status,
    nullif(pg_catalog.btrim(coalesce(p_reason, '')), ''),
    p_actor_employee_id
  );

  insert into public.audit_events (
    actor_employee_id,
    actor_role,
    branch_id,
    action,
    entity_type,
    entity_id,
    patient_id,
    previous_value,
    new_value,
    reason,
    result,
    success
  ) values (
    p_actor_employee_id,
    v_actor_role,
    v_branch_id,
    'appointment.status_update',
    'appointments',
    p_appointment_id,
    v_patient_id,
    pg_catalog.jsonb_build_object('status', v_current_status),
    pg_catalog.jsonb_build_object('status', p_new_status),
    coalesce(nullif(pg_catalog.btrim(coalesce(p_reason, '')), ''), 'Operational transition'),
    'success',
    true
  );

  return p_appointment_id;
end;
$$;

revoke execute on function public.create_appointment_atomic(uuid, uuid, uuid, uuid, uuid, timestamptz, timestamptz, text, uuid)
from public, anon, authenticated;
revoke execute on function public.transition_appointment_atomic(uuid, public.appointment_status, public.appointment_status, text, uuid)
from public, anon, authenticated;

grant execute on function public.create_appointment_atomic(uuid, uuid, uuid, uuid, uuid, timestamptz, timestamptz, text, uuid)
to service_role;
grant execute on function public.transition_appointment_atomic(uuid, public.appointment_status, public.appointment_status, text, uuid)
to service_role;
