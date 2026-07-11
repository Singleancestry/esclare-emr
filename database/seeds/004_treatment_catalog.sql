insert into public.service_categories (id, name, display_order) values
  ('40000000-0000-4000-8000-000000000001', 'Facials', 10),
  ('40000000-0000-4000-8000-000000000002', 'Laser and Brightening', 20),
  ('40000000-0000-4000-8000-000000000003', 'Lifting and Contouring', 30),
  ('40000000-0000-4000-8000-000000000004', 'Doctor Procedures', 40),
  ('40000000-0000-4000-8000-000000000005', 'Skin Support', 50),
  ('40000000-0000-4000-8000-000000000006', 'Wellness', 60)
on conflict (name) do update set display_order = excluded.display_order;

insert into public.services (id, category_id, code, name, public_summary, doctor_required, pregnancy_restricted, public_visible) values
  ('41000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'FAC-KOREAN', 'Korean Facial', 'Multi-step cleansing, extraction, massage, mask, serum and hydration facial.', false, false, true),
  ('41000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', 'FAC-HYDRAJET', 'HydraJet Peel', 'Peel-focused facial with extraction, serum, cryotherapy, mask and light therapy.', false, false, true),
  ('41000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000002', 'LAS-PICO-FACE', 'Pico Glow Face', 'Laser care for the appearance of pigmentation and uneven tone.', false, true, true),
  ('41000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000003', 'LIFT-HIFU-FACE', '7D HIFU Face', 'Focused-ultrasound treatment for lifting and tightening.', false, true, true),
  ('41000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000004', 'DOC-JAWTOX', 'Jawtox', 'Doctor-assessed masseter botulinum toxin procedure.', true, false, true),
  ('41000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000004', 'DOC-REJURAN-H', 'Rejuran H / Healer', 'Doctor-assessed skin-rejuvenation procedure.', true, false, true),
  ('41000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000005', 'SKIN-MCCM-PDRN', 'MCCM PDRN Skin Support', 'Professional topical skin-support treatment.', false, false, true),
  ('41000000-0000-4000-8000-000000000008', '40000000-0000-4000-8000-000000000006', 'WELL-HIKARI', 'Hikari Drip', 'Clinic-administered IV treatment subject to suitability screening.', false, false, true)
on conflict (code) do update set name = excluded.name, public_summary = excluded.public_summary,
  doctor_required = excluded.doctor_required, pregnancy_restricted = excluded.pregnancy_restricted,
  public_visible = excluded.public_visible;

insert into public.price_versions (id, name, status, effective_from, source_reference, published_at, published_by, created_by)
select '42000000-0000-4000-8000-000000000001', 'Management regular prices - July 2026', 'published', '2026-07-01',
  'ESCLARE Master Knowledge updated July 1, 2026', now(), e.id, e.id
from public.employees e order by e.created_at limit 1
on conflict (id) do nothing;

insert into public.service_prices (price_version_id, service_id, price_kind, amount_min, price_unit) values
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000001', 'fixed', 1800, 'session'),
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000002', 'fixed', 1999, 'session'),
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000003', 'fixed', 3500, 'session'),
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000004', 'fixed', 4999, 'session'),
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000005', 'fixed', 10000, null),
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000006', 'fixed', 25000, null),
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000007', 'fixed', 3800, 'session'),
  ('42000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000008', 'fixed', 3000, 'session')
on conflict (price_version_id, service_id) do update set amount_min = excluded.amount_min, price_unit = excluded.price_unit;

insert into public.branch_services (branch_id, service_id, is_available)
select b.id, s.id, true from public.branches b cross join public.services s
on conflict (branch_id, service_id) do nothing;
