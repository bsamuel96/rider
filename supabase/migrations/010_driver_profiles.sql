create table if not exists public.driver_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  license_number text not null,
  license_expiry date,
  experience_years integer default 0,
  main_city text,
  service_region text,
  rating numeric default 5,
  total_rides integer default 0,
  online boolean not null default false,
  approved_at timestamptz,
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists driver_profiles_user_id_idx
on public.driver_profiles(user_id);

alter table public.vehicles
  alter column driver_id drop not null,
  alter column brand drop not null,
  alter column model drop not null,
  alter column plate_number drop not null;

alter table public.vehicles
add column if not exists owner_id uuid references public.profiles(id),
add column if not exists owner_role text check (owner_role in ('driver', 'roadside_operator')),
add column if not exists color text,
add column if not exists production_year integer,
add column if not exists seats integer,
add column if not exists capacity_kg integer,
add column if not exists vehicle_status text not null default 'pending_review'
  check (vehicle_status in ('pending_review', 'active', 'maintenance', 'suspended', 'retired')),
add column if not exists updated_at timestamptz not null default now();

do $$
begin
  alter table public.vehicles drop constraint if exists vehicles_vehicle_type_check;
  alter table public.vehicles add constraint vehicles_vehicle_type_check
    check (vehicle_type in ('standard', 'premium', 'tow', 'roadside', 'tow_truck', 'service_van', 'motorcycle', 'utility'));
end $$;

create index if not exists vehicles_owner_id_idx on public.vehicles(owner_id);
create index if not exists vehicles_owner_role_idx on public.vehicles(owner_role);
create index if not exists vehicles_vehicle_status_idx on public.vehicles(vehicle_status);
