-- Patient registration and its required child records must commit or roll back together.
create or replace function public.create_patient_atomic(
  p_payload jsonb,
  p_actor_employee_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_branch_id uuid := (p_payload->>'branchId')::uuid;
  v_patient_id uuid := public.gen_random_uuid();
  v_patient_number text := 'ESC-P-' || pg_catalog.upper(pg_catalog.substr(pg_catalog.replace(public.gen_random_uuid()::text, '-', ''), 1, 12));
  v_actor_role text;
begin
  select r.key
  into v_actor_role
  from public.employees e
  join public.app_users u on u.id = e.app_user_id
  join public.employee_branch_roles ebr on ebr.employee_id = e.id
  join public.roles r on r.id = ebr.role_id
  join public.role_permissions rp on rp.role_id = r.id
  join public.permissions permission on permission.id = rp.permission_id
  where e.id = p_actor_employee_id
    and e.status = 'active'
    and u.status = 'active'
    and ebr.branch_id = v_branch_id
    and ebr.starts_at <= pg_catalog.now()
    and (ebr.ends_at is null or ebr.ends_at > pg_catalog.now())
    and permission.key = 'patients.create'
  order by r.privileged desc, ebr.created_at
  limit 1;

  if v_actor_role is null then
    raise exception using errcode = '42501', message = 'patient registration actor is not authorized';
  end if;

  -- Serialize equivalent identity fingerprints so concurrent submissions cannot both
  -- pass duplicate detection. The final ten mobile digits normalize 09xx and +639xx.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      pg_catalog.concat_ws(
        '|',
        pg_catalog.lower(pg_catalog.btrim(p_payload->>'firstName')),
        pg_catalog.lower(pg_catalog.btrim(p_payload->>'lastName')),
        p_payload->>'dateOfBirth',
        pg_catalog.right(pg_catalog.regexp_replace(p_payload->>'mobile', '[^0-9]', '', 'g'), 10)
      ),
      0
    )
  );

  if exists (
    select 1
    from public.patients patient
    where patient.archived_at is null
      and pg_catalog.lower(patient.first_name) = pg_catalog.lower(p_payload->>'firstName')
      and pg_catalog.lower(patient.last_name) = pg_catalog.lower(p_payload->>'lastName')
      and patient.date_of_birth = (p_payload->>'dateOfBirth')::date
      and pg_catalog.right(pg_catalog.regexp_replace(patient.mobile, '[^0-9]', '', 'g'), 10)
        = pg_catalog.right(pg_catalog.regexp_replace(p_payload->>'mobile', '[^0-9]', '', 'g'), 10)
  ) then
    raise exception using errcode = '23505', message = 'possible duplicate patient';
  end if;

  insert into public.patients (
    id,
    patient_number,
    home_branch_id,
    first_name,
    middle_name,
    last_name,
    preferred_name,
    date_of_birth,
    sex_at_birth,
    gender,
    civil_status,
    nationality,
    mobile,
    secondary_mobile,
    email,
    preferred_contact_method,
    preferred_language,
    created_by
  ) values (
    v_patient_id,
    v_patient_number,
    v_branch_id,
    p_payload->>'firstName',
    nullif(p_payload->>'middleName', ''),
    p_payload->>'lastName',
    nullif(p_payload->>'preferredName', ''),
    (p_payload->>'dateOfBirth')::date,
    (p_payload->>'sexAtBirth')::public.patient_sex_at_birth,
    nullif(p_payload->>'gender', ''),
    nullif(p_payload->>'civilStatus', ''),
    p_payload->>'nationality',
    p_payload->>'mobile',
    nullif(p_payload->>'secondaryMobile', ''),
    nullif(p_payload->>'email', '')::public.citext,
    (p_payload->>'preferredContactMethod')::public.patient_contact_method,
    p_payload->>'preferredLanguage',
    p_actor_employee_id
  );

  insert into public.patient_branch_links (patient_id, branch_id, created_by)
  values (v_patient_id, v_branch_id, p_actor_employee_id);

  insert into public.patient_addresses (
    patient_id, country, region, province, city_municipality, barangay, street, building, postal_code, created_by
  ) values (
    v_patient_id,
    p_payload->>'country',
    p_payload->>'region',
    p_payload->>'province',
    p_payload->>'cityMunicipality',
    p_payload->>'barangay',
    nullif(p_payload->>'street', ''),
    nullif(p_payload->>'building', ''),
    nullif(p_payload->>'postalCode', ''),
    p_actor_employee_id
  );

  insert into public.patient_emergency_contacts (
    patient_id, name, relationship, mobile, secondary_contact, created_by
  ) values (
    v_patient_id,
    p_payload->>'emergencyName',
    p_payload->>'emergencyRelationship',
    p_payload->>'emergencyMobile',
    nullif(p_payload->>'emergencySecondaryContact', ''),
    p_actor_employee_id
  );

  insert into public.patient_physical_information (patient_id, height_cm, weight_kg, created_by)
  values (
    v_patient_id,
    nullif(p_payload->>'heightCm', '')::numeric,
    nullif(p_payload->>'weightKg', '')::numeric,
    p_actor_employee_id
  );

  insert into public.patient_marketing_preferences (
    patient_id, referral_source, referred_by, campaign, promo_code,
    sms_marketing_consent, email_marketing_consent, created_by
  ) values (
    v_patient_id,
    nullif(p_payload->>'referralSource', ''),
    nullif(p_payload->>'referredBy', ''),
    nullif(p_payload->>'campaign', ''),
    nullif(p_payload->>'promoCode', ''),
    coalesce((p_payload->>'smsMarketingConsent')::boolean, false),
    coalesce((p_payload->>'emailMarketingConsent')::boolean, false),
    p_actor_employee_id
  );

  insert into public.patient_privacy_acknowledgements (
    patient_id, identity_verification_method, verified_by, branch_id, created_by
  ) values (
    v_patient_id,
    p_payload->>'identityVerificationMethod',
    p_payload->>'verifiedBy',
    v_branch_id,
    p_actor_employee_id
  );

  insert into public.patient_medical_profiles (patient_id, alert_level, alert_reason, created_by)
  values (
    v_patient_id,
    'informational',
    'Initial intake pending medical profile review.',
    p_actor_employee_id
  );

  insert into public.audit_events (
    actor_employee_id,
    actor_role,
    branch_id,
    action,
    entity_type,
    entity_id,
    patient_id,
    reason,
    result,
    success
  ) values (
    p_actor_employee_id,
    v_actor_role,
    v_branch_id,
    'patient.create',
    'patients',
    v_patient_id,
    v_patient_id,
    'Patient registration',
    'success',
    true
  );

  return pg_catalog.jsonb_build_object('patientId', v_patient_id, 'patientNumber', v_patient_number);
end;
$$;

revoke execute on function public.create_patient_atomic(jsonb, uuid) from public, anon, authenticated;
grant execute on function public.create_patient_atomic(jsonb, uuid) to service_role;
