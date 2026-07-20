create type public.price_status as enum ('draft', 'approved', 'published', 'retired');
create type public.price_kind as enum ('fixed', 'starts_at', 'range', 'assessment');
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id)
);
create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id),
  code text not null unique,
  name text not null,
  public_summary text not null,
  doctor_required boolean not null default false,
  pregnancy_restricted boolean not null default false,
  public_visible boolean not null default false,
  archived_at timestamptz,
  archived_by uuid references public.employees(id),
  archive_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id)
);
create table public.price_versions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status public.price_status not null default 'draft',
  effective_from date not null,
  effective_until date,
  source_reference text,
  approved_at timestamptz,
  approved_by uuid references public.employees(id),
  published_at timestamptz,
  published_by uuid references public.employees(id),
  created_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  constraint price_version_dates_valid check (effective_until is null or effective_until >= effective_from),
  constraint published_version_has_metadata check (
    status <> 'published' or (published_at is not null and published_by is not null)
  )
);
create table public.service_prices (
  id uuid primary key default gen_random_uuid(),
  price_version_id uuid not null references public.price_versions(id),
  service_id uuid not null references public.services(id),
  price_kind public.price_kind not null,
  amount_min numeric(12, 2),
  amount_max numeric(12, 2),
  price_unit text,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  unique (price_version_id, service_id),
  constraint service_price_amounts_valid check (
    (price_kind = 'assessment' and amount_min is null and amount_max is null)
    or (price_kind in ('fixed', 'starts_at') and amount_min >= 0 and amount_max is null)
    or (price_kind = 'range' and amount_min >= 0 and amount_max >= amount_min)
  )
);
create table public.branch_services (
  branch_id uuid not null references public.branches(id),
  service_id uuid not null references public.services(id),
  is_available boolean not null default true,
  booking_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  primary key (branch_id, service_id)
);
create index services_category_idx on public.services (category_id, archived_at);
create index service_prices_version_idx on public.service_prices (price_version_id);
create index branch_services_service_idx on public.branch_services (service_id, branch_id);
create trigger service_categories_set_updated_at before update on public.service_categories
for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();
create trigger branch_services_set_updated_at before update on public.branch_services
for each row execute function public.set_updated_at();
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.price_versions enable row level security;
alter table public.service_prices enable row level security;
alter table public.branch_services enable row level security;
create policy service_categories_staff_read on public.service_categories for select to authenticated
using (public.current_employee_has_permission('services.view'));
create policy service_categories_manage on public.service_categories for all to authenticated
using (public.current_employee_has_permission('services.update'))
with check (public.current_employee_has_permission('services.update'));
create policy services_staff_read on public.services for select to authenticated
using (public.current_employee_has_permission('services.view'));
create policy services_create on public.services for insert to authenticated
with check (public.current_employee_has_permission('services.create'));
create policy services_update on public.services for update to authenticated
using (public.current_employee_has_permission('services.update'))
with check (public.current_employee_has_permission('services.update'));
create policy price_versions_read on public.price_versions for select to authenticated
using (public.current_employee_has_permission('prices.view'));
create policy price_versions_propose on public.price_versions for insert to authenticated
with check (status = 'draft' and public.current_employee_has_permission('prices.propose'));
create policy price_versions_approve on public.price_versions for update to authenticated
using (public.current_employee_has_permission('prices.approve'))
with check (
  (status in ('draft', 'approved') and public.current_employee_has_permission('prices.approve'))
  or (status in ('published', 'retired') and public.current_employee_has_permission('prices.publish'))
);
create policy service_prices_read on public.service_prices for select to authenticated
using (public.current_employee_has_permission('prices.view'));
create policy service_prices_propose on public.service_prices for insert to authenticated
with check (
  public.current_employee_has_permission('prices.propose')
  and exists (select 1 from public.price_versions pv where pv.id = price_version_id and pv.status = 'draft')
);
create policy service_prices_update_draft on public.service_prices for update to authenticated
using (
  public.current_employee_has_permission('prices.propose')
  and exists (select 1 from public.price_versions pv where pv.id = price_version_id and pv.status = 'draft')
)
with check (
  public.current_employee_has_permission('prices.propose')
  and exists (select 1 from public.price_versions pv where pv.id = price_version_id and pv.status = 'draft')
);
create policy branch_services_read on public.branch_services for select to authenticated
using (public.current_employee_has_permission('services.view', branch_id));
create policy branch_services_manage on public.branch_services for all to authenticated
using (public.current_employee_has_permission('services.update', branch_id))
with check (public.current_employee_has_permission('services.update', branch_id));
