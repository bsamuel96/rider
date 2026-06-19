insert into public.profiles (id, email, phone, username, full_name, role, active_instance, registration_status, theme)
values
  ('00000000-0000-0000-0000-000000000101', 'client@rider.local', '+40700000101', 'client_demo', 'Client Demo', 'client', 'customer', 'active', 'system'),
  ('00000000-0000-0000-0000-000000000102', 'driver@rider.local', '+40700000102', 'driver_demo', 'Șofer Demo', 'driver', 'driver', 'active', 'dark'),
  ('00000000-0000-0000-0000-000000000103', 'operator@rider.local', '+40700000103', 'operator_demo', 'Operator Roadside', 'roadside_operator', 'roadside', 'active', 'dark'),
  ('00000000-0000-0000-0000-000000000104', 'admin@rider.local', '+40700000104', 'admin_demo', 'Admin Rider', 'admin', 'customer', 'active', 'dark')
on conflict (id) do update
set email = excluded.email,
    phone = excluded.phone,
    username = excluded.username,
    full_name = excluded.full_name,
    role = excluded.role,
    active_instance = excluded.active_instance,
    registration_status = excluded.registration_status,
    theme = excluded.theme;
