alter table public.patients
add column if not exists masked_mobile text generated always as (
  case
    when char_length(mobile) >= 4 then '***-***-' || right(mobile, 4)
    else '***'
  end
) stored;

-- Patient rows include identity, contact, clinical, and financial-adjacent fields.
-- Reviewed server modules use explicit field lists and branch-scoped permissions;
-- generated REST/GraphQL clients receive no direct table access.
revoke select, insert, update, delete on table public.patients from authenticated, anon;
revoke insert, update, delete on table public.patient_branch_links from authenticated, anon;

-- These domains contain contact or medical data. Reviewed server paths enforce the
-- finer application permission before using the service client to read them.
revoke select on table public.patient_addresses from authenticated, anon;
revoke select on table public.patient_emergency_contacts from authenticated, anon;
revoke select on table public.patient_physical_information from authenticated, anon;
revoke select on table public.patient_medical_profiles from authenticated, anon;
revoke select on table public.patient_marketing_preferences from authenticated, anon;
revoke select on table public.patient_privacy_acknowledgements from authenticated, anon;
revoke select on table public.patient_contact_reveals from authenticated, anon;
revoke insert, update, delete on table public.patient_addresses from authenticated, anon;
revoke insert, update, delete on table public.patient_emergency_contacts from authenticated, anon;
revoke insert, update, delete on table public.patient_physical_information from authenticated, anon;
revoke insert, update, delete on table public.patient_marketing_preferences from authenticated, anon;
revoke insert, update, delete on table public.patient_privacy_acknowledgements from authenticated, anon;
revoke insert, update, delete on table public.patient_medical_profiles from authenticated, anon;
revoke insert, update, delete on table public.patient_contact_reveals from authenticated, anon;
