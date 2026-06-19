alter table public.driver_profiles enable row level security;
alter table public.roadside_operator_profiles enable row level security;
alter table public.user_documents enable row level security;
alter table public.login_audit_events enable row level security;

drop policy if exists "profiles_update_own_or_admin" on public.profiles;

create policy "profiles_update_basic_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
    and registration_status = (select registration_status from public.profiles where id = auth.uid())
  );

create policy "profiles_admin_update_all"
  on public.profiles for update
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "driver_profiles_driver_select_own"
  on public.driver_profiles for select
  using (user_id = auth.uid() or public.current_role() = 'admin');

create policy "driver_profiles_driver_insert_own"
  on public.driver_profiles for insert
  with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "driver_profiles_driver_update_own"
  on public.driver_profiles for update
  using (user_id = auth.uid() or public.current_role() = 'admin')
  with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "roadside_profiles_operator_select_own"
  on public.roadside_operator_profiles for select
  using (user_id = auth.uid() or public.current_role() = 'admin');

create policy "roadside_profiles_operator_insert_own"
  on public.roadside_operator_profiles for insert
  with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "roadside_profiles_operator_update_own"
  on public.roadside_operator_profiles for update
  using (user_id = auth.uid() or public.current_role() = 'admin')
  with check (user_id = auth.uid() or public.current_role() = 'admin');

drop policy if exists "vehicles_admin_driver_select" on public.vehicles;
drop policy if exists "vehicles_admin_driver_write" on public.vehicles;

create policy "vehicles_owner_or_admin_select"
  on public.vehicles for select
  using (owner_id = auth.uid() or driver_id = auth.uid() or public.current_role() = 'admin');

create policy "vehicles_owner_or_admin_write"
  on public.vehicles for all
  using (owner_id = auth.uid() or driver_id = auth.uid() or public.current_role() = 'admin')
  with check (owner_id = auth.uid() or driver_id = auth.uid() or public.current_role() = 'admin');

create policy "user_documents_owner_or_admin_select"
  on public.user_documents for select
  using (user_id = auth.uid() or public.current_role() = 'admin');

create policy "user_documents_owner_insert"
  on public.user_documents for insert
  with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "user_documents_admin_update"
  on public.user_documents for update
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "login_audit_admin_select"
  on public.login_audit_events for select
  using (public.current_role() = 'admin');

create policy "login_audit_authenticated_insert"
  on public.login_audit_events for insert
  with check (auth.role() = 'authenticated');
