create table if not exists public.roadside_operator_locations (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references public.profiles(id) on delete cascade,
  lat numeric not null,
  lng numeric not null,
  heading numeric not null default 0,
  updated_at timestamptz not null default now(),
  unique(operator_id)
);

create index if not exists roadside_operator_locations_operator_id_idx
  on public.roadside_operator_locations(operator_id);

create index if not exists roadside_operator_locations_updated_at_idx
  on public.roadside_operator_locations(updated_at desc);

alter table public.roadside_operator_locations enable row level security;

drop policy if exists "roadside_locations_select_related" on public.roadside_operator_locations;
drop policy if exists "roadside_locations_operator_insert" on public.roadside_operator_locations;
drop policy if exists "roadside_locations_operator_update" on public.roadside_operator_locations;
drop policy if exists "roadside_locations_operator_delete" on public.roadside_operator_locations;

create policy "roadside_locations_select_related"
  on public.roadside_operator_locations for select
  using (
    public.current_role() = 'admin'
    or operator_id = auth.uid()
    or exists (
      select 1
      from public.roadside_requests r
      where r.operator_id = roadside_operator_locations.operator_id
        and (r.user_id = auth.uid() or r.operator_id = auth.uid())
        and r.status in ('accepted', 'en_route', 'arrived', 'in_progress')
    )
  );

create policy "roadside_locations_operator_insert"
  on public.roadside_operator_locations for insert
  with check (
    public.current_role() = 'admin'
    or (operator_id = auth.uid() and public.current_role() = 'roadside_operator')
  );

create policy "roadside_locations_operator_update"
  on public.roadside_operator_locations for update
  using (
    operator_id = auth.uid()
    or public.current_role() = 'admin'
  )
  with check (
    operator_id = auth.uid()
    or public.current_role() = 'admin'
  );

create policy "roadside_locations_operator_delete"
  on public.roadside_operator_locations for delete
  using (operator_id = auth.uid() or public.current_role() = 'admin');

do $$
begin
  alter publication supabase_realtime add table public.roadside_operator_locations;
exception when duplicate_object then null;
end $$;
