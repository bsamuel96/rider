create table if not exists public.roadside_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  operator_id uuid references public.profiles(id) on delete set null,
  issue_type text not null check (issue_type in ('flat_tire', 'battery', 'engine', 'accident', 'fuel', 'other')),
  description text,
  status text not null default 'searching' check (
    status in ('searching', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled')
  ),
  lat numeric not null,
  lng numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists roadside_requests_user_id_idx on public.roadside_requests(user_id);
create index if not exists roadside_requests_operator_id_idx on public.roadside_requests(operator_id);
create index if not exists roadside_requests_status_idx on public.roadside_requests(status);
