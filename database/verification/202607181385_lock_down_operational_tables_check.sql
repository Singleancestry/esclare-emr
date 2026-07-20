with protected_tables(table_name) as (
  values
    ('appointments'),
    ('appointment_events'),
    ('appointment_requests'),
    ('audit_events'),
    ('patient_contact_reveals')
)
select
  table_name,
  not has_table_privilege('anon', format('public.%I', table_name), 'select')
    and not has_table_privilege('authenticated', format('public.%I', table_name), 'select')
    and not has_table_privilege('authenticated', format('public.%I', table_name), 'insert')
    and not has_table_privilege('authenticated', format('public.%I', table_name), 'update')
    and not has_table_privilege('authenticated', format('public.%I', table_name), 'delete')
    as client_access_revoked
from protected_tables
order by table_name;
