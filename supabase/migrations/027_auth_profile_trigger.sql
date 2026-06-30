create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  requested_role text := coalesce(metadata ->> 'role', 'client');
  requested_instance text := coalesce(metadata ->> 'active_instance', 'customer');
  requested_status text := coalesce(metadata ->> 'registration_status', 'active');
  requested_theme text := coalesce(metadata ->> 'theme', 'system');
  requested_payment text := coalesce(metadata ->> 'preferred_payment_method', 'cash');
  requested_username text := nullif(trim(metadata ->> 'username'), '');
  safe_username text;
begin
  if requested_role not in ('client', 'driver', 'roadside_operator', 'fleet_manager', 'admin') then
    requested_role := 'client';
  end if;

  if requested_instance not in ('customer', 'driver', 'roadside', 'fleet_manager') then
    requested_instance := 'customer';
  end if;

  if requested_status not in ('draft', 'pending_review', 'active', 'suspended', 'rejected') then
    requested_status := 'active';
  end if;

  if requested_theme not in ('light', 'dark', 'system') then
    requested_theme := 'system';
  end if;

  if requested_payment not in ('cash', 'card') then
    requested_payment := 'cash';
  end if;

  safe_username := requested_username;

  if safe_username is not null and exists (
    select 1 from public.profiles where lower(username) = lower(safe_username)
  ) then
    safe_username := safe_username || '_' || substr(new.id::text, 1, 8);
  end if;

  insert into public.profiles (
    id,
    email,
    phone,
    username,
    full_name,
    role,
    active_instance,
    registration_status,
    theme,
    preferred_payment_method
  )
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(metadata ->> 'phone', '')), ''),
    safe_username,
    nullif(trim(coalesce(metadata ->> 'full_name', '')), ''),
    requested_role,
    requested_instance,
    requested_status,
    requested_theme,
    requested_payment
  )
  on conflict (id) do update set
    email = excluded.email,
    phone = excluded.phone,
    username = excluded.username,
    full_name = excluded.full_name,
    role = excluded.role,
    active_instance = excluded.active_instance,
    registration_status = excluded.registration_status,
    theme = excluded.theme,
    preferred_payment_method = excluded.preferred_payment_method,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user_profile();
