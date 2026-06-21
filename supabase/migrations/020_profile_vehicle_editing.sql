alter table public.profiles
add column if not exists username text,
add column if not exists preferred_payment_method text not null default 'cash'
  check (preferred_payment_method in ('cash', 'card')),
add column if not exists emergency_contact_name text,
add column if not exists emergency_contact_phone text,
add column if not exists language text,
add column if not exists default_address text,
add column if not exists home_address text,
add column if not exists work_address text,
add column if not exists updated_at timestamptz not null default now();

alter table public.vehicles
add column if not exists owner_id uuid references public.profiles(id) on delete cascade,
add column if not exists owner_role text check (owner_role in ('driver', 'roadside_operator')),
add column if not exists color text,
add column if not exists production_year integer,
add column if not exists seats integer,
add column if not exists fuel_type text,
add column if not exists capacity_kg integer,
add column if not exists photo_url text,
add column if not exists notes text,
add column if not exists equipment text,
add column if not exists service_types text[] not null default '{}',
add column if not exists vehicle_status text not null default 'pending_review'
  check (vehicle_status in ('pending_review', 'active', 'maintenance', 'suspended', 'retired')),
add column if not exists updated_at timestamptz not null default now();

create index if not exists vehicles_owner_id_idx on public.vehicles(owner_id);
