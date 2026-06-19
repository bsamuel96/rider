alter table public.profiles
add column if not exists username text,
add column if not exists active_instance text not null default 'customer'
  check (active_instance in ('customer', 'driver', 'roadside')),
add column if not exists registration_status text not null default 'active'
  check (registration_status in ('draft', 'pending_review', 'active', 'suspended', 'rejected')),
add column if not exists updated_at timestamptz not null default now();

create unique index if not exists profiles_username_unique_idx
on public.profiles (lower(username))
where username is not null;

create table if not exists public.login_audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  requested_instance text,
  resolved_role text,
  success boolean not null default false,
  failure_reason text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists login_audit_events_user_id_idx on public.login_audit_events(user_id);
create index if not exists login_audit_events_created_at_idx on public.login_audit_events(created_at);
