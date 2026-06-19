alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.roadside_requests enable row level security;
alter table public.driver_locations enable row level security;
alter table public.notifications enable row level security;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'client');
$$;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.current_role() = 'admin');

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.current_role() = 'admin')
  with check (id = auth.uid() or public.current_role() = 'admin');

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "addresses_owner_all"
  on public.addresses for all
  using (user_id = auth.uid() or public.current_role() = 'admin')
  with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "vehicles_admin_driver_select"
  on public.vehicles for select
  using (driver_id = auth.uid() or public.current_role() in ('admin', 'roadside_operator'));

create policy "vehicles_admin_driver_write"
  on public.vehicles for all
  using (driver_id = auth.uid() or public.current_role() = 'admin')
  with check (driver_id = auth.uid() or public.current_role() = 'admin');

create policy "bookings_client_driver_admin_select"
  on public.bookings for select
  using (user_id = auth.uid() or driver_id = auth.uid() or public.current_role() in ('admin', 'roadside_operator'));

create policy "bookings_client_insert"
  on public.bookings for insert
  with check (user_id = auth.uid());

create policy "bookings_driver_admin_update"
  on public.bookings for update
  using (user_id = auth.uid() or driver_id = auth.uid() or public.current_role() = 'admin')
  with check (user_id = auth.uid() or driver_id = auth.uid() or public.current_role() = 'admin');

create policy "roadside_client_operator_admin_select"
  on public.roadside_requests for select
  using (user_id = auth.uid() or operator_id = auth.uid() or public.current_role() in ('admin', 'roadside_operator'));

create policy "roadside_client_insert"
  on public.roadside_requests for insert
  with check (user_id = auth.uid());

create policy "roadside_operator_admin_update"
  on public.roadside_requests for update
  using (operator_id = auth.uid() or public.current_role() in ('admin', 'roadside_operator'))
  with check (operator_id = auth.uid() or public.current_role() in ('admin', 'roadside_operator'));

create policy "driver_locations_select_authenticated"
  on public.driver_locations for select
  using (auth.role() = 'authenticated');

create policy "driver_locations_driver_upsert"
  on public.driver_locations for all
  using (driver_id = auth.uid() or public.current_role() = 'admin')
  with check (driver_id = auth.uid() or public.current_role() = 'admin');

create policy "notifications_owner_all"
  on public.notifications for all
  using (user_id = auth.uid() or public.current_role() = 'admin')
  with check (user_id = auth.uid() or public.current_role() = 'admin');

do $$
begin
  alter publication supabase_realtime add table public.bookings;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.roadside_requests;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.driver_locations;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;
