alter table public.bookings
add column if not exists accepted_at timestamptz,
add column if not exists driver_en_route_at timestamptz,
add column if not exists arrived_at timestamptz,
add column if not exists trip_started_at timestamptz,
add column if not exists completed_at timestamptz,
add column if not exists cancelled_at timestamptz,
add column if not exists cancellation_reason text,
add column if not exists driver_workflow_status text default 'offline',
add column if not exists driver_notes text,
add column if not exists cash_collected_at timestamptz;

create table if not exists public.driver_availability (
  driver_id uuid primary key references public.profiles(id) on delete cascade,
  online boolean not null default false,
  workflow_status text not null default 'offline',
  lat numeric,
  lng numeric,
  shift_started_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.driver_ride_offers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
  expires_at timestamptz not null,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (booking_id, driver_id)
);

create table if not exists public.driver_shift_sessions (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  online_minutes integer not null default 0,
  completed_rides integer not null default 0,
  gross_earnings numeric not null default 0,
  cash_collected numeric not null default 0,
  card_earnings numeric not null default 0,
  currency text not null default 'RON'
);

create table if not exists public.driver_earnings_ledger (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  amount numeric not null,
  payment_method text not null check (payment_method in ('cash', 'card')),
  entry_type text not null default 'fare',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.driver_events (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.driver_availability enable row level security;
alter table public.driver_ride_offers enable row level security;
alter table public.driver_shift_sessions enable row level security;
alter table public.driver_earnings_ledger enable row level security;
alter table public.driver_events enable row level security;

drop policy if exists "driver_availability_owner_all" on public.driver_availability;
create policy "driver_availability_owner_all"
on public.driver_availability for all
using (driver_id = auth.uid())
with check (driver_id = auth.uid());

drop policy if exists "driver_ride_offers_owner_all" on public.driver_ride_offers;
create policy "driver_ride_offers_owner_all"
on public.driver_ride_offers for all
using (driver_id = auth.uid())
with check (driver_id = auth.uid());

drop policy if exists "driver_shift_sessions_owner_all" on public.driver_shift_sessions;
create policy "driver_shift_sessions_owner_all"
on public.driver_shift_sessions for all
using (driver_id = auth.uid())
with check (driver_id = auth.uid());

drop policy if exists "driver_earnings_ledger_owner_all" on public.driver_earnings_ledger;
create policy "driver_earnings_ledger_owner_all"
on public.driver_earnings_ledger for all
using (driver_id = auth.uid())
with check (driver_id = auth.uid());

drop policy if exists "driver_events_owner_all" on public.driver_events;
create policy "driver_events_owner_all"
on public.driver_events for all
using (driver_id = auth.uid())
with check (driver_id = auth.uid());
