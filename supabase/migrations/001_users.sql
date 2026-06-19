create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  username text,
  full_name text,
  avatar_url text,
  role text not null default 'client' check (role in ('client', 'driver', 'roadside_operator', 'admin')),
  active_instance text not null default 'customer' check (active_instance in ('customer', 'driver', 'roadside')),
  registration_status text not null default 'active' check (registration_status in ('draft', 'pending_review', 'active', 'suspended', 'rejected')),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create unique index if not exists profiles_username_unique_idx
on public.profiles (lower(username))
where username is not null;
