insert into public.profiles (id, email, phone, full_name, role, theme)
values
  ('00000000-0000-0000-0000-000000000101', 'client@rider.local', '+40700000101', 'Client Demo', 'client', 'system'),
  ('00000000-0000-0000-0000-000000000102', 'driver@rider.local', '+40700000102', 'Șofer Demo', 'driver', 'dark'),
  ('00000000-0000-0000-0000-000000000103', 'operator@rider.local', '+40700000103', 'Operator Roadside', 'roadside_operator', 'dark'),
  ('00000000-0000-0000-0000-000000000104', 'admin@rider.local', '+40700000104', 'Admin Rider', 'admin', 'dark')
on conflict (id) do update
set email = excluded.email,
    phone = excluded.phone,
    full_name = excluded.full_name,
    role = excluded.role,
    theme = excluded.theme;
