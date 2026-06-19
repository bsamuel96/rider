create table if not exists public.driver_locations (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  lat numeric not null,
  lng numeric not null,
  updated_at timestamptz not null default now(),
  unique(driver_id)
);

create index if not exists driver_locations_driver_id_idx on public.driver_locations(driver_id);
