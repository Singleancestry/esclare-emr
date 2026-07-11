insert into public.appointment_requests (
  id,
  public_reference,
  branch_id,
  full_name,
  service_id,
  requested_service,
  preferred_date,
  preferred_time,
  status,
  source
)
select
  '00000000-0000-4000-8000-000000000501',
  'WEB-DEMO-NAGA-01',
  b.id,
  'Marina Santos',
  s.id,
  s.name,
  current_date + 3,
  '14:00',
  'pending',
  'website'
from public.branches b
join public.services s on s.code = 'korean-facial'
where b.code = 'NAGA'
on conflict (public_reference) do nothing;

insert into public.appointment_requests (
  id,
  public_reference,
  branch_id,
  full_name,
  service_id,
  requested_service,
  preferred_date,
  preferred_time,
  status,
  source,
  status_reason
)
select
  '00000000-0000-4000-8000-000000000502',
  'WEB-DEMO-DAET-01',
  b.id,
  'Elena Reyes',
  s.id,
  s.name,
  current_date + 5,
  '11:30',
  'contacted',
  'website',
  'Client contacted through Facebook Messenger.'
from public.branches b
join public.services s on s.code = 'hydrajet-peel'
where b.code = 'DAET'
on conflict (public_reference) do nothing;
