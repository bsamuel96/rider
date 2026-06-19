create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid references public.profiles(id) on delete set null,
  pickup_address text not null,
  destination_address text not null,
  pickup_lat numeric not null,
  pickup_lng numeric not null,
  destination_lat numeric not null,
  destination_lng numeric not null,
  service_type text not null check (service_type in ('standard', 'premium', 'tow', 'roadside')),
  status text not null default 'searching' check (
    status in ('searching', 'confirmed', 'driver_en_route', 'arrived', 'in_progress', 'completed', 'cancelled')
  ),
  price numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_driver_id_idx on public.bookings(driver_id);
create index if not exists bookings_status_idx on public.bookings(status);
