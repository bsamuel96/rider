alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check
check (role in ('client', 'driver', 'roadside_operator', 'fleet_manager', 'admin'));

alter table public.profiles
drop constraint if exists profiles_active_instance_check;

alter table public.profiles
add constraint profiles_active_instance_check
check (active_instance in ('customer', 'driver', 'roadside', 'fleet_manager'));

create table if not exists public.fleet_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.fleets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.fleet_organizations(id) on delete cascade,
  name text not null,
  fleet_type text not null check (fleet_type in ('transport', 'roadside')),
  created_at timestamptz not null default now()
);

create table if not exists public.fleet_members (
  id uuid primary key default gen_random_uuid(),
  fleet_id uuid not null references public.fleets(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('fleet_manager', 'driver', 'roadside_operator')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  unique (fleet_id, user_id)
);

create table if not exists public.fleet_vehicles (
  id uuid primary key default gen_random_uuid(),
  fleet_id uuid not null references public.fleets(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  vehicle_kind text not null check (vehicle_kind in ('standard_car', 'premium_car', 'tow_truck', 'service_van', 'utility_vehicle')),
  brand text,
  model text,
  plate_number text,
  status text not null default 'pending_review' check (status in ('pending_review', 'active', 'maintenance', 'suspended', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fleets_organization_id_idx on public.fleets(organization_id);
create index if not exists fleets_fleet_type_idx on public.fleets(fleet_type);
create index if not exists fleet_members_fleet_id_idx on public.fleet_members(fleet_id);
create index if not exists fleet_members_user_id_idx on public.fleet_members(user_id);
create index if not exists fleet_vehicles_fleet_id_idx on public.fleet_vehicles(fleet_id);
create index if not exists fleet_vehicles_owner_id_idx on public.fleet_vehicles(owner_id);

alter table public.fleet_organizations enable row level security;
alter table public.fleets enable row level security;
alter table public.fleet_members enable row level security;
alter table public.fleet_vehicles enable row level security;

create or replace function public.is_fleet_member(target_fleet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.fleet_members fm
    where fm.fleet_id = target_fleet_id
      and fm.user_id = auth.uid()
      and fm.status = 'active'
  );
$$;

create or replace function public.is_fleet_manager_for_fleet(target_fleet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.fleet_members fm
    where fm.fleet_id = target_fleet_id
      and fm.user_id = auth.uid()
      and fm.role = 'fleet_manager'
      and fm.status = 'active'
  );
$$;

create or replace function public.is_fleet_manager_for_organization(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.fleets f
    join public.fleet_members fm on fm.fleet_id = f.id
    where f.organization_id = target_organization_id
      and fm.user_id = auth.uid()
      and fm.role = 'fleet_manager'
      and fm.status = 'active'
  );
$$;

create policy "fleet_organizations_manager_or_admin_select"
  on public.fleet_organizations for select
  using (public.current_role() = 'admin' or public.is_fleet_manager_for_organization(fleet_organizations.id));

create policy "fleet_organizations_admin_write"
  on public.fleet_organizations for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "fleets_member_select"
  on public.fleets for select
  using (public.current_role() = 'admin' or public.is_fleet_member(fleets.id));

create policy "fleets_manager_write"
  on public.fleets for all
  using (public.current_role() = 'admin' or public.is_fleet_manager_for_fleet(fleets.id))
  with check (public.current_role() = 'admin' or public.is_fleet_manager_for_fleet(fleets.id));

create policy "fleet_members_member_select"
  on public.fleet_members for select
  using (public.current_role() = 'admin' or user_id = auth.uid() or public.is_fleet_manager_for_fleet(fleet_members.fleet_id));

create policy "fleet_members_manager_write"
  on public.fleet_members for all
  using (public.current_role() = 'admin' or public.is_fleet_manager_for_fleet(fleet_members.fleet_id))
  with check (public.current_role() = 'admin' or public.is_fleet_manager_for_fleet(fleet_members.fleet_id));

create policy "fleet_vehicles_member_select"
  on public.fleet_vehicles for select
  using (public.current_role() = 'admin' or owner_id = auth.uid() or public.is_fleet_member(fleet_vehicles.fleet_id));

create policy "fleet_vehicles_manager_write"
  on public.fleet_vehicles for all
  using (public.current_role() = 'admin' or public.is_fleet_manager_for_fleet(fleet_vehicles.fleet_id))
  with check (public.current_role() = 'admin' or public.is_fleet_manager_for_fleet(fleet_vehicles.fleet_id));
