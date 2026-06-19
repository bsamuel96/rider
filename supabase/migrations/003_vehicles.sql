create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_type text not null check (vehicle_type in ('standard', 'premium', 'tow', 'roadside')),
  brand text not null,
  model text not null,
  plate_number text not null unique,
  status text not null default 'available' check (status in ('available', 'busy', 'offline', 'maintenance')),
  created_at timestamptz not null default now()
);

create index if not exists vehicles_driver_id_idx on public.vehicles(driver_id);
create index if not exists vehicles_status_idx on public.vehicles(status);
