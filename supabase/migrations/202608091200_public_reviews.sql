create table if not exists public.public_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_display_name text not null check (char_length(reviewer_display_name) between 1 and 120),
  review_text text not null check (char_length(review_text) between 10 and 4000),
  rating smallint not null check (rating between 1 and 5),
  review_date date not null,
  source text not null check (source in ('google', 'facebook', 'manual', 'other')),
  original_review_url text,
  source_profile_url text,
  verified boolean not null default false,
  featured boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 100 check (display_order between 0 and 10000),
  imported_at timestamptz not null default now(),
  last_checked_at timestamptz,
  admin_notes text,
  clinic_response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.employees(id),
  updated_by uuid references public.employees(id),
  archived_at timestamptz,
  archived_by uuid references public.employees(id),
  archive_reason text,
  constraint review_archive_complete check (
    (archived_at is null and archived_by is null and archive_reason is null)
    or (archived_at is not null and archived_by is not null and char_length(archive_reason) >= 5)
  )
);

create index if not exists public_reviews_public_idx on public.public_reviews (published, featured, display_order, review_date desc) where archived_at is null;
alter table public.public_reviews enable row level security;
revoke all on public.public_reviews from anon, authenticated;
grant select, insert, update on public.public_reviews to service_role;

comment on table public.public_reviews is 'Moderated, source-attributed public reviews. Records are archived rather than deleted.';
