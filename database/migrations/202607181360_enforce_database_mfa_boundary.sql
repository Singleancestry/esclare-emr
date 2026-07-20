-- Enforce required MFA inside database authorization helpers, not only in Next.js.
create or replace function public.current_employee_mfa_satisfied()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.app_users u
    where u.auth_user_id = auth.uid()
      and u.status = 'active'
      and (not u.mfa_required or coalesce(auth.jwt() ->> 'aal', '') = 'aal2')
  )
$$;

-- Keep the context query private and expose it only through an MFA-gated wrapper.
alter function public.get_staff_context() rename to get_staff_context_unchecked;
revoke execute on function public.get_staff_context_unchecked() from public, anon, authenticated;

create or replace function public.get_staff_context()
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select case
    when public.current_employee_mfa_satisfied()
      then public.get_staff_context_unchecked()
    else null
  end
$$;

create or replace function public.current_employee_has_branch(branch uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select public.current_employee_mfa_satisfied()
    and exists (
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
  select public.current_employee_mfa_satisfied()
    and exists (
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

revoke execute on function public.current_employee_mfa_satisfied() from public, anon;
revoke execute on function public.get_staff_context() from public, anon;
revoke execute on function public.current_employee_has_branch(uuid) from public, anon;
revoke execute on function public.current_employee_has_permission(text, uuid) from public, anon;
grant execute on function public.current_employee_mfa_satisfied() to authenticated, service_role;
grant execute on function public.get_staff_context() to authenticated, service_role;
grant execute on function public.current_employee_has_branch(uuid) to authenticated, service_role;
grant execute on function public.current_employee_has_permission(text, uuid) to authenticated, service_role;
