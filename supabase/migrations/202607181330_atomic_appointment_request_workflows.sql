alter table public.appointment_requests
add column if not exists idempotency_key uuid;

alter table public.appointment_requests
add column if not exists request_fingerprint text;

alter table public.appointment_requests
add constraint appointment_requests_idempotency_key_unique unique (idempotency_key);

create or replace function public.create_public_appointment_request_atomic(
  p_idempotency_key uuid,
  p_request_fingerprint text,
  p_public_reference text,
  p_branch_id uuid,
  p_full_name text,
  p_service_id uuid,
  p_requested_service text,
  p_preferred_date date,
  p_preferred_time time
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_request_id uuid;
  v_reference text;
begin
  if pg_catalog.char_length(coalesce(p_request_fingerprint, '')) <> 64 then
    raise exception using errcode = '23514', message = 'invalid request fingerprint';
  end if;

  select public_reference into v_reference
  from public.appointment_requests
  where idempotency_key = p_idempotency_key
    and request_fingerprint = p_request_fingerprint;
  if found then
    return v_reference;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_request_fingerprint, 1)
  );

  if (
    select pg_catalog.count(*) >= 5
    from public.appointment_requests request
    where request.request_fingerprint = p_request_fingerprint
      and request.submitted_at > pg_catalog.now() - interval '15 minutes'
  ) then
    raise exception using errcode = 'P0001', message = 'appointment request rate limit exceeded';
  end if;

  insert into public.appointment_requests (
    idempotency_key, request_fingerprint, public_reference, branch_id, full_name, service_id,
    requested_service, preferred_date, preferred_time, source
  ) values (
    p_idempotency_key, p_request_fingerprint, p_public_reference, p_branch_id, pg_catalog.btrim(p_full_name), p_service_id,
    nullif(pg_catalog.btrim(coalesce(p_requested_service, '')), ''), p_preferred_date, p_preferred_time, 'website'
  )
  on conflict (idempotency_key) do nothing
  returning id, public_reference into v_request_id, v_reference;

  if v_request_id is null then
    select id, public_reference into v_request_id, v_reference
    from public.appointment_requests
    where idempotency_key = p_idempotency_key
      and request_fingerprint = p_request_fingerprint;

    if v_request_id is null then
      raise exception using errcode = '40001', message = 'appointment request replay could not be resolved';
    end if;
    return v_reference;
  end if;

  insert into public.audit_events (
    actor_role, branch_id, action, entity_type, entity_id, new_value, reason, result, success
  ) values (
    'public', p_branch_id, 'appointment_request.create', 'appointment_requests', v_request_id,
    pg_catalog.jsonb_build_object('reference', v_reference, 'status', 'pending', 'source', 'website'),
    'Public website appointment request', 'success', true
  );

  return v_reference;
end;
$$;

create or replace function public.transition_appointment_request_atomic(
  p_request_id uuid,
  p_expected_status public.appointment_request_status,
  p_new_status public.appointment_request_status,
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
  v_current_status public.appointment_request_status;
  v_actor_role text;
  v_now timestamptz := pg_catalog.now();
begin
  select branch_id, status into v_branch_id, v_current_status
  from public.appointment_requests
  where id = p_request_id and archived_at is null
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'appointment request is not available';
  end if;
  if v_current_status <> p_expected_status then
    raise exception using errcode = '40001', message = 'appointment request changed concurrently';
  end if;
  if not (
    (v_current_status = 'pending' and p_new_status in ('contacted', 'confirmed', 'declined', 'cancelled', 'archived'))
    or (v_current_status = 'contacted' and p_new_status in ('confirmed', 'declined', 'cancelled', 'archived'))
    or (v_current_status = 'confirmed' and p_new_status in ('cancelled', 'archived'))
    or (v_current_status in ('declined', 'cancelled') and p_new_status = 'archived')
  ) then
    raise exception using errcode = '23514', message = 'invalid appointment request transition';
  end if;
  if pg_catalog.char_length(pg_catalog.btrim(coalesce(p_reason, ''))) < 3 then
    raise exception using errcode = '23514', message = 'status reason is required';
  end if;

  select r.key into v_actor_role
  from public.employees e
  join public.app_users u on u.id = e.app_user_id
  join public.employee_branch_roles ebr on ebr.employee_id = e.id
  join public.roles r on r.id = ebr.role_id
  join public.role_permissions rp on rp.role_id = r.id
  join public.permissions permission on permission.id = rp.permission_id
  where e.id = p_actor_employee_id
    and e.status = 'active'
    and u.status = 'active'
    and ebr.branch_id = v_branch_id
    and ebr.starts_at <= v_now
    and (ebr.ends_at is null or ebr.ends_at > v_now)
    and permission.key = 'appointments.confirm'
  order by r.privileged desc, ebr.created_at
  limit 1;

  if v_actor_role is null then
    raise exception using errcode = '42501', message = 'appointment request actor is not authorized';
  end if;

  update public.appointment_requests
  set status = p_new_status,
      status_reason = pg_catalog.btrim(p_reason),
      handled_by = p_actor_employee_id,
      handled_at = v_now,
      archived_at = case when p_new_status = 'archived' then v_now else null end,
      archived_by = case when p_new_status = 'archived' then p_actor_employee_id else null end,
      archive_reason = case when p_new_status = 'archived' then pg_catalog.btrim(p_reason) else null end
  where id = p_request_id;

  insert into public.audit_events (
    actor_employee_id, actor_role, branch_id, action, entity_type, entity_id,
    previous_value, new_value, reason, result, success
  ) values (
    p_actor_employee_id, v_actor_role, v_branch_id, 'appointment_request.status_update',
    'appointment_requests', p_request_id,
    pg_catalog.jsonb_build_object('status', v_current_status),
    pg_catalog.jsonb_build_object('status', p_new_status),
    pg_catalog.btrim(p_reason), 'success', true
  );

  return p_request_id;
end;
$$;

revoke execute on function public.create_public_appointment_request_atomic(uuid, text, text, uuid, text, uuid, text, date, time)
from public, anon, authenticated;
revoke execute on function public.transition_appointment_request_atomic(uuid, public.appointment_request_status, public.appointment_request_status, text, uuid)
from public, anon, authenticated;
grant execute on function public.create_public_appointment_request_atomic(uuid, text, text, uuid, text, uuid, text, date, time)
to service_role;
grant execute on function public.transition_appointment_request_atomic(uuid, public.appointment_request_status, public.appointment_request_status, text, uuid)
to service_role;
