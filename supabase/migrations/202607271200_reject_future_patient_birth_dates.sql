-- Reject invalid future identity dates even when a server write bypasses application validation.
do $$
begin
  if exists (
    select 1
    from public.patients
    where date_of_birth > current_date
  ) then
    raise exception using
      errcode = '23514',
      message = 'future patient birth dates require protected manual review before migration';
  end if;
end;
$$;

create or replace function public.reject_future_patient_birth_date()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.date_of_birth > current_date then
    raise exception using
      errcode = '22007',
      message = 'patient date of birth cannot be in the future';
  end if;

  return new;
end;
$$;

drop trigger if exists patients_reject_future_birth_date on public.patients;

create trigger patients_reject_future_birth_date
before insert or update of date_of_birth on public.patients
for each row
execute function public.reject_future_patient_birth_date();

revoke execute on function public.reject_future_patient_birth_date()
from public, anon, authenticated;
