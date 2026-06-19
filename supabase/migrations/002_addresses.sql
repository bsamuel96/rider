create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  address text not null,
  lat numeric not null,
  lng numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses(user_id);
