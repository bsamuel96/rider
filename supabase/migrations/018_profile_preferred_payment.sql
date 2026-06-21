alter table public.profiles
add column if not exists preferred_payment_method text not null default 'cash'
check (preferred_payment_method in ('cash', 'card'));

create table if not exists public.recent_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  address text not null,
  lat numeric not null,
  lng numeric not null,
  last_used_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.recent_locations enable row level security;

drop policy if exists "recent_locations_owner_all" on public.recent_locations;

create policy "recent_locations_owner_all"
on public.recent_locations for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
