alter table public.branches enable row level security;
alter table public.app_users enable row level security;
alter table public.employees enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.employee_branch_roles enable row level security;
alter table public.trusted_devices enable row level security;
alter table public.rooms enable row level security;
alter table public.devices enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.current_employee_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select e.id
  from public.employees e
  join public.app_users u on u.id = e.app_user_id
  where u.auth_user_id = auth.uid()
    and u.status = 'active'
    and e.status = 'active'
  limit 1
$$;

create or replace function public.current_employee_has_branch(branch uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.employee_branch_roles ebr
    where ebr.employee_id = public.current_employee_id()
      and ebr.branch_id = branch
      and (ebr.ends_at is null or ebr.ends_at > now())
  )
$$;

create or replace function public.current_employee_has_permission(permission_key text, branch uuid default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.employee_branch_roles ebr
    join public.roles r on r.id = ebr.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    where ebr.employee_id = public.current_employee_id()
      and p.key = permission_key
      and (branch is null or ebr.branch_id = branch)
      and (ebr.ends_at is null or ebr.ends_at > now())
  )
$$;

create or replace function public.get_staff_context()
returns jsonb
language sql
stable
security definer
set search_path = public
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
      and (ebr.ends_at is null or ebr.ends_at > now())
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
      and (ebr.ends_at is null or ebr.ends_at > now())
  ),
  permission_list as (
    select coalesce(jsonb_agg(distinct p.key), '[]'::jsonb) as permissions
    from public.employee_branch_roles ebr
    join public.role_permissions rp on rp.role_id = ebr.role_id
    join public.permissions p on p.id = rp.permission_id
    where ebr.employee_id = public.current_employee_id()
      and (ebr.ends_at is null or ebr.ends_at > now())
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
    'permissions', pl.permissions
  )
  from current_employee ce
  join active_assignment aa on aa.employee_id = ce.id
  join public.branches b on b.id = aa.branch_id
  cross join branch_list bl
  cross join permission_list pl
$$;

create policy branches_select_for_staff
on public.branches
for select
to authenticated
using (
  public.current_employee_has_branch(id)
  or public.current_employee_has_permission('reports.view_all')
);

create policy app_users_select_self_or_employee_admin
on public.app_users
for select
to authenticated
using (
  auth_user_id = auth.uid()
  or public.current_employee_has_permission('employees.view')
);

create policy employees_select_branch_staff
on public.employees
for select
to authenticated
using (
  id = public.current_employee_id()
  or exists (
    select 1
    from public.employee_branch_roles own_role
    join public.employee_branch_roles target_role on target_role.branch_id = own_role.branch_id
    where own_role.employee_id = public.current_employee_id()
      and target_role.employee_id = employees.id
      and public.current_employee_has_permission('employees.view', own_role.branch_id)
  )
);

create policy employees_update_employee_admin
on public.employees
for update
to authenticated
using (public.current_employee_has_permission('employees.update'))
with check (public.current_employee_has_permission('employees.update'));

create policy roles_select_staff
on public.roles
for select
to authenticated
using (public.current_employee_id() is not null);

create policy permissions_select_staff
on public.permissions
for select
to authenticated
using (public.current_employee_id() is not null);

create policy role_permissions_select_staff
on public.role_permissions
for select
to authenticated
using (public.current_employee_id() is not null);

create policy role_permissions_manage_security
on public.role_permissions
for all
to authenticated
using (public.current_employee_has_permission('security.manage_roles'))
with check (public.current_employee_has_permission('security.manage_roles'));

create policy employee_branch_roles_select_branch_admin
on public.employee_branch_roles
for select
to authenticated
using (
  employee_id = public.current_employee_id()
  or public.current_employee_has_permission('employees.view', branch_id)
);

create policy employee_branch_roles_manage_security
on public.employee_branch_roles
for all
to authenticated
using (public.current_employee_has_permission('security.manage_roles', branch_id))
with check (public.current_employee_has_permission('security.manage_roles', branch_id));

create policy trusted_devices_select_self_or_security
on public.trusted_devices
for select
to authenticated
using (
  employee_id = public.current_employee_id()
  or public.current_employee_has_permission('security.manage_devices', branch_id)
);

create policy trusted_devices_manage_security
on public.trusted_devices
for update
to authenticated
using (public.current_employee_has_permission('security.manage_devices', branch_id))
with check (public.current_employee_has_permission('security.manage_devices', branch_id));

create policy rooms_select_branch_staff
on public.rooms
for select
to authenticated
using (public.current_employee_has_branch(branch_id));

create policy devices_select_branch_staff
on public.devices
for select
to authenticated
using (public.current_employee_has_branch(branch_id));

create policy audit_events_insert_staff
on public.audit_events
for insert
to authenticated
with check (actor_employee_id = public.current_employee_id());

create policy audit_events_select_security
on public.audit_events
for select
to authenticated
using (
  public.current_employee_has_permission('security.view_audit', branch_id)
  or public.current_employee_has_permission('reports.view_all')
);
