create or replace function public.reveal_patient_contact_atomic(
  p_patient_id uuid,
  p_branch_id uuid,
  p_reason text,
  p_actor_employee_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor_role text;
  v_mobile text;
  v_email text;
begin
  if pg_catalog.char_length(pg_catalog.btrim(coalesce(p_reason, ''))) < 3 then
    raise exception using errcode = '23514', message = 'contact reveal reason is required';
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
    and ebr.branch_id = p_branch_id
    and ebr.starts_at <= pg_catalog.now()
    and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
    and permission.key = 'patients.reveal_contact'
  order by r.privileged desc, ebr.created_at
  limit 1;

  if v_actor_role is null then
    raise exception using errcode = '42501', message = 'contact reveal actor is not authorized';
  end if;

  select mobile, email::text into v_mobile, v_email
  from public.patients
  where id = p_patient_id
    and home_branch_id = p_branch_id
    and archived_at is null;

  if not found then
    raise exception using errcode = '42501', message = 'patient contact is not available';
  end if;

  insert into public.patient_contact_reveals (
    patient_id, revealed_by, branch_id, reason, revealed_fields
  ) values (
    p_patient_id, p_actor_employee_id, p_branch_id, pg_catalog.btrim(p_reason), array['mobile', 'email']
  );

  insert into public.audit_events (
    actor_employee_id, actor_role, branch_id, action, entity_type, entity_id,
    patient_id, reason, result, success
  ) values (
    p_actor_employee_id, v_actor_role, p_branch_id, 'patient.contact_reveal',
    'patients', p_patient_id, p_patient_id, pg_catalog.btrim(p_reason), 'success', true
  );

  return pg_catalog.jsonb_build_object('mobile', v_mobile, 'email', v_email);
end;
$$;

revoke execute on function public.reveal_patient_contact_atomic(uuid, uuid, text, uuid)
from public, anon, authenticated;
grant execute on function public.reveal_patient_contact_atomic(uuid, uuid, text, uuid)
to service_role;
