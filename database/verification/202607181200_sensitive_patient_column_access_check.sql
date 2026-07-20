select
  not has_table_privilege('authenticated', 'public.patients', 'select')
    as authenticated_cannot_directly_select_patients,
  not has_column_privilege('authenticated', 'public.patients', 'mobile', 'select')
    as authenticated_cannot_select_mobile,
  not has_column_privilege('authenticated', 'public.patients', 'secondary_mobile', 'select')
    as authenticated_cannot_select_secondary_mobile,
  not has_column_privilege('authenticated', 'public.patients', 'email', 'select')
    as authenticated_cannot_select_email,
  not has_table_privilege('authenticated', 'public.patient_addresses', 'select')
    as authenticated_cannot_directly_select_addresses,
  not has_table_privilege('authenticated', 'public.patient_emergency_contacts', 'select')
    as authenticated_cannot_directly_select_emergency_contacts,
  not has_table_privilege('authenticated', 'public.patient_physical_information', 'select')
    as authenticated_cannot_directly_select_physical_information,
  not has_table_privilege('authenticated', 'public.patient_medical_profiles', 'select')
    as authenticated_cannot_directly_select_medical_profiles,
  not has_table_privilege('authenticated', 'public.patients', 'update')
    as authenticated_cannot_directly_update_patients,
  not has_table_privilege('authenticated', 'public.patient_branch_links', 'insert')
    as authenticated_cannot_link_patients_to_branches;
