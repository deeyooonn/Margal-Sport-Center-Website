-- ============================================================
-- Margal Sports Center — Seed Data
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/ogampgkmgjpzzqdyswlk
-- ============================================================

-- Courts
INSERT INTO public.courts (id, name, sport_type, description, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Badminton Court 1', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('11111111-0000-0000-0000-000000000002', 'Badminton Court 2', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('11111111-0000-0000-0000-000000000003', 'Badminton Court 3', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('11111111-0000-0000-0000-000000000004', 'Badminton Court 4', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('11111111-0000-0000-0000-000000000005', 'Badminton Court 5', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('11111111-0000-0000-0000-000000000006', 'Badminton Court 6', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('11111111-0000-0000-0000-000000000007', 'Badminton Court 7', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('11111111-0000-0000-0000-000000000008', 'Badminton Court 8', 'badminton', 'Professional-grade badminton court with wooden flooring', true),
  ('22222222-0000-0000-0000-000000000001', 'Basketball Court 1', 'basketball', 'Full-size regulation basketball court', true),
  ('22222222-0000-0000-0000-000000000002', 'Basketball Court 2', 'basketball', 'Full-size regulation basketball court', true),
  ('33333333-0000-0000-0000-000000000001', 'Futsal Court', 'futsal', 'Indoor futsal court with artificial turf', true),
  ('44444444-0000-0000-0000-000000000001', 'Multi-Purpose Venue', 'multi', 'Spacious indoor venue for events, tournaments & more', true)
ON CONFLICT (id) DO NOTHING;

-- Rates (per sport type)
INSERT INTO public.rates (court_id, label, start_hour, end_hour, price_per_hour, applies_on) VALUES
  -- Badminton: off-peak (8am–5pm) ₱120/hr, peak (5pm–12mn) ₱150/hr
  ('11111111-0000-0000-0000-000000000001', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000001', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000002', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000002', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000003', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000003', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000004', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000004', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000005', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000005', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000006', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000006', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000007', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000007', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000008', 'Off-Peak', 8, 17, 120.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('11111111-0000-0000-0000-000000000008', 'Peak Hours', 17, 24, 150.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  -- Basketball: flat ₱800/hr
  ('22222222-0000-0000-0000-000000000001', 'Standard', 8, 24, 350.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  ('22222222-0000-0000-0000-000000000002', 'Standard', 8, 24, 350.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  -- Futsal: flat ₱600/hr
  ('33333333-0000-0000-0000-000000000001', 'Standard', 8, 24, 600.00, '{mon,tue,wed,thu,fri,sat,sun}'),
  -- Multi-purpose: flat ₱1500/hr
  ('44444444-0000-0000-0000-000000000001', 'Standard', 8, 24, 1500.00, '{mon,tue,wed,thu,fri,sat,sun}')
ON CONFLICT DO NOTHING;
