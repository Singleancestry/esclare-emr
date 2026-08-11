-- Additive-only treatment records identified in the August 9, 2026 catalog audit.
-- Existing service and price rows are intentionally left untouched.

insert into public.service_categories (id, name, display_order) values
  ('40000000-0000-4000-8000-000000000001', 'Facials', 10),
  ('40000000-0000-4000-8000-000000000002', 'Laser and Brightening', 20),
  ('40000000-0000-4000-8000-000000000003', 'Lifting and Contouring', 30),
  ('40000000-0000-4000-8000-000000000004', 'Doctor Procedures', 40),
  ('40000000-0000-4000-8000-000000000005', 'Skin Support', 50)
on conflict (name) do nothing;

insert into public.services
  (id, category_id, code, name, public_summary, doctor_required, pregnancy_restricted, public_visible)
values
  ('43000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'FAC-ADDONS', 'Facial Treatment Add-ons', 'Optional professional serums, masks and exfoliation steps selected after assessment.', false, false, true),
  ('43000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', 'FAC-BOTOX', 'Botox Facial', 'Doctor-assessed facial botulinum toxin treatment for selected rejuvenation and skin-quality goals.', true, false, true),
  ('43000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000001', 'FAC-BACK-ACNE', 'Back Acne Care', 'Assessment-led cleansing, extraction and selected peel or light-therapy steps for acne-prone skin on the back.', false, false, true),
  ('43000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', 'LAS-PICO-SPOT', 'Pico Spot Treatment', 'Targeted picosecond laser treatment for selected small pigment spots after skin assessment.', false, true, true),
  ('43000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000003', 'LIFT-HIFU-EXILIFT', 'HIFU + Exilift', 'Combined focused-ultrasound and Exilift plan for selected face or body contouring concerns.', false, true, true),
  ('43000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000003', 'LIFT-MESO-EXILIFT', 'Mesotherapy + Exilift Contouring', 'Doctor-assessed mesotherapy combined with Exilift for selected contouring areas.', true, true, true),
  ('43000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000004', 'DOC-TRAPTOX', 'Traptox', 'Doctor-assessed botulinum toxin procedure for selected trapezius concerns.', true, false, true),
  ('43000000-0000-4000-8000-000000000008', '40000000-0000-4000-8000-000000000004', 'DOC-PALMAR-TOX', 'Palmar Hyperhidrosis Treatment', 'Doctor-assessed botulinum toxin treatment for excessive sweating of the palms.', true, false, true),
  ('43000000-0000-4000-8000-000000000009', '40000000-0000-4000-8000-000000000004', 'DOC-CATS-EYE', 'Cat''s Eye / Eyebrow Lift', 'Doctor-performed thread procedure planned after anatomical assessment.', true, false, true),
  ('43000000-0000-4000-8000-000000000010', '40000000-0000-4000-8000-000000000004', 'DOC-MINOR-SKIN', 'Minor Skin Procedures', 'Doctor-assessed treatment of selected minor skin lesions.', true, false, true),
  ('43000000-0000-4000-8000-000000000011', '40000000-0000-4000-8000-000000000004', 'DOC-RF-MICRONEEDLING', 'RF Microneedling', 'Doctor-assessed radiofrequency microneedling for selected texture or stretch-mark concerns.', true, true, true),
  ('43000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000004', 'DOC-ACNE-STUB', 'Acne Stub Stop', 'Doctor-assessed CO2 laser treatment for selected recurrent or stubborn acne lesions.', true, true, true),
  ('43000000-0000-4000-8000-000000000013', '40000000-0000-4000-8000-000000000004', 'DOC-VASCULAR', 'Vascular Treatments', 'Professional assessment is required to determine the appropriate method and suitability.', false, true, true),
  ('43000000-0000-4000-8000-000000000014', '40000000-0000-4000-8000-000000000005', 'SKIN-MCCM-GLASS', 'MCCM Glass Skin / Skin Booster', 'Doctor-assessed professional skin-booster treatment for selected hydration and skin-quality goals.', true, true, true),
  ('43000000-0000-4000-8000-000000000015', '40000000-0000-4000-8000-000000000001', 'FAC-ACNE-PDT', 'Acne Care with PDT', 'Assessment-led acne care using selected cleansing, extraction, salicylic peel and PDT light-therapy steps.', false, true, true)
on conflict (code) do nothing;

insert into public.price_versions
  (id, name, status, effective_from, source_reference)
values
  ('44000000-0000-4000-8000-000000000001', 'August 2026 additive treatment audit', 'draft', '2026-08-09', 'ESCLARE Master Knowledge updated August 9, 2026')
on conflict (id) do nothing;

insert into public.service_prices
  (price_version_id, service_id, price_kind, amount_min, price_unit, notes)
values
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000001', 'starts_at', 150, 'add-on', 'Individual add-on prices remain item-specific.'),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000002', 'fixed', 2000, 'session', null),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000003', 'assessment', null, null, 'Source prices conflict; confirm the selected back-acne protocol.'),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000004', 'fixed', 500, 'spot/session', null),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000005', 'starts_at', 4999, 'session', 'Area-specific price applies.'),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000006', 'starts_at', 2500, 'session', 'Area-specific price applies.'),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000007', 'fixed', 15000, null, null),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000008', 'fixed', 15000, null, null),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000009', 'fixed', 5000, null, null),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000010', 'starts_at', 1000, null, 'Procedure-specific price applies after doctor assessment.'),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000011', 'starts_at', 3500, 'session', 'Area and adjunct-specific price applies.'),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000012', 'starts_at', 2500, '1-3 lesions', null),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000013', 'assessment', null, null, 'Single-session prices are method-specific; provider classification and facial package require confirmation.'),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000014', 'fixed', 4000, 'session', null),
  ('44000000-0000-4000-8000-000000000001', '43000000-0000-4000-8000-000000000015', 'starts_at', 1500, 'session', 'Protocol-specific price applies.')
on conflict (price_version_id, service_id) do nothing;

insert into public.branch_services (branch_id, service_id, is_available)
select b.id, s.id, true
from public.branches b
cross join public.services s
where s.id between '43000000-0000-4000-8000-000000000001' and '43000000-0000-4000-8000-000000000015'
on conflict (branch_id, service_id) do nothing;
