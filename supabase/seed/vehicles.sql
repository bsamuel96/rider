insert into public.vehicles (driver_id, vehicle_type, brand, model, plate_number, status)
values
  ('00000000-0000-0000-0000-000000000102', 'standard', 'Dacia', 'Jogger', 'B101RID', 'available'),
  ('00000000-0000-0000-0000-000000000102', 'premium', 'Tesla', 'Model 3', 'B102RID', 'available'),
  ('00000000-0000-0000-0000-000000000103', 'tow', 'Mercedes-Benz', 'Sprinter', 'B103RID', 'available')
on conflict (plate_number) do update
set status = excluded.status;
