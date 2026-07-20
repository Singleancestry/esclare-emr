-- Support the public-request quota lookup during abusive or burst traffic.
create index if not exists appointment_requests_fingerprint_submitted_idx
  on public.appointment_requests (request_fingerprint, submitted_at desc)
  where request_fingerprint is not null;
