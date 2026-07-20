-- Preserve the branch associated with every permission and ignore future assignments.
create or replace function public.current_employee_has_branch(branch uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.employee_branch_roles ebr
    where ebr.employee_id = public.current_employee_id()
      and ebr.branch_id = branch
      and ebr.starts_at <= pg_catalog.now()
      and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
  )
$$;

create or replace function public.current_employee_has_permission(permission_key text, branch uuid default null)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.employee_branch_roles ebr
    join public.role_permissions rp on rp.role_id = ebr.role_id
    join public.permissions permission on permission.id = rp.permission_id
    where ebr.employee_id = public.current_employee_id()
      and permission.key = permission_key
      and (branch is null or ebr.branch_id = branch)
      and ebr.starts_at <= pg_catalog.now()
      and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
  )
$$;

create or replace function public.get_staff_context()
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  with current_employee as (
    select
      e.id,
      u.auth_user_id,
      e.employee_number,
      e.display_name,
      u.email,
      e.status,
      u.mfa_required
    from public.employees e
    join public.app_users u on u.id = e.app_user_id
    where e.id = public.current_employee_id()
  ),
  active_assignment as (
    select ebr.employee_id, ebr.branch_id, r.key as role_key, r.name as role_name
    from public.employee_branch_roles ebr
    join public.roles r on r.id = ebr.role_id
    where ebr.employee_id = public.current_employee_id()
      and ebr.starts_at <= pg_catalog.now()
      and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
    order by
      case r.key
        when 'owner' then 1
        when 'super_admin' then 2
        when 'branch_manager' then 3
        else 10
      end,
      ebr.created_at
    limit 1
  ),
  branch_list as (
    select coalesce(
      jsonb_agg(distinct jsonb_build_object('id', b.id, 'code', b.code, 'name', b.name)),
      '[]'::jsonb
    ) as branches
    from public.employee_branch_roles ebr
    join public.branches b on b.id = ebr.branch_id
    where ebr.employee_id = public.current_employee_id()
      and b.archived_at is null
      and ebr.starts_at <= pg_catalog.now()
      and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
  ),
  assignment_permissions as (
    select
      ebr.branch_id,
      coalesce(jsonb_agg(distinct permission.key), '[]'::jsonb) as permissions
    from public.employee_branch_roles ebr
    join public.role_permissions rp on rp.role_id = ebr.role_id
    join public.permissions permission on permission.id = rp.permission_id
    where ebr.employee_id = public.current_employee_id()
      and ebr.starts_at <= pg_catalog.now()
      and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
    group by ebr.branch_id
  ),
  branch_permission_map as (
    select coalesce(
      jsonb_object_agg(ap.branch_id::text, ap.permissions),
      '{}'::jsonb
    ) as permissions_by_branch
    from assignment_permissions ap
  ),
  active_permission_list as (
    select coalesce(ap.permissions, '[]'::jsonb) as permissions
    from active_assignment aa
    left join assignment_permissions ap on ap.branch_id = aa.branch_id
  )
  select jsonb_build_object(
    'employee', jsonb_build_object(
      'id', ce.id,
      'authUserId', ce.auth_user_id,
      'employeeNumber', ce.employee_number,
      'displayName', ce.display_name,
      'email', ce.email,
      'status', ce.status,
      'mfaRequired', ce.mfa_required
    ),
    'branches', bl.branches,
    'activeBranch', jsonb_build_object('id', b.id, 'code', b.code, 'name', b.name),
    'activeRole', jsonb_build_object('key', aa.role_key, 'name', aa.role_name),
    'permissions', apl.permissions,
    'branchPermissions', bpm.permissions_by_branch
  )
  from current_employee ce
  join active_assignment aa on aa.employee_id = ce.id
  join public.branches b on b.id = aa.branch_id
  cross join branch_list bl
  cross join active_permission_list apl
  cross join branch_permission_map bpm
$$;

revoke execute on function public.current_employee_has_branch(uuid) from public, anon;
revoke execute on function public.current_employee_has_permission(text, uuid) from public, anon;
revoke execute on function public.get_staff_context() from public, anon;
grant execute on function public.current_employee_has_branch(uuid) to authenticated, service_role;
grant execute on function public.current_employee_has_permission(text, uuid) to authenticated, service_role;
grant execute on function public.get_staff_context() to authenticated, service_role;
