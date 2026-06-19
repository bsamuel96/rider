create table if not exists public.roadside_operator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_name text,
  fiscal_code text,
  dispatcher_phone text,
  company_email text,
  main_city text,
  service_regions text[],
  service_types text[] not null default '{}',
  online boolean not null default false,
  rating numeric default 5,
  total_jobs integer default 0,
  approved_at timestamptz,
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists roadside_operator_profiles_user_id_idx
on public.roadside_operator_profiles(user_id);
