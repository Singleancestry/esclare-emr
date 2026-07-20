select exists (
  select 1
  from pg_catalog.pg_indexes
  where schemaname = 'public'
    and tablename = 'appointment_requests'
    and indexname = 'appointment_requests_fingerprint_submitted_idx'
    and indexdef ilike '%request_fingerprint%submitted_at%'
) as request_rate_limit_index_exists;
