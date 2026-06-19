create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  full_name text,
  avatar_url text,
  role text not null default 'client' check (role in ('client', 'driver', 'roadside_operator', 'admin')),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
