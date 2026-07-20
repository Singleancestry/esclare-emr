-- Identity and authorization data is available only through reviewed server boundaries.
revoke all on table
  public.app_users,
  public.employees,
  public.roles,
  public.permissions,
  public.role_permissions,
  public.employee_branch_roles,
  public.trusted_devices
from anon, authenticated;

grant select, insert, update, delete on table
  public.app_users,
  public.employees,
  public.roles,
  public.permissions,
  public.role_permissions,
  public.employee_branch_roles,
  public.trusted_devices
to service_role;

drop policy if exists employees_update_authorized on public.employees;
drop policy if exists role_permissions_manage on public.role_permissions;
drop policy if exists employee_branch_roles_manage on public.employee_branch_roles;
drop policy if exists trusted_devices_manage on public.trusted_devices;
