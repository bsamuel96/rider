insert into public.vehicles (driver_id, owner_id, owner_role, vehicle_type, brand, model, plate_number, status, vehicle_status)
values
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000102', 'driver', 'standard', 'Dacia', 'Jogger', 'B101RID', 'available', 'active'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000102', 'driver', 'premium', 'Tesla', 'Model 3', 'B102RID', 'available', 'active'),
  (null, '00000000-0000-0000-0000-000000000103', 'roadside_operator', 'tow_truck', 'Mercedes-Benz', 'Sprinter', 'B103RID', 'available', 'active')
on conflict (plate_number) do update
set status = excluded.status,
    owner_id = excluded.owner_id,
    owner_role = excluded.owner_role,
    vehicle_status = excluded.vehicle_status;
