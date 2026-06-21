create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  related_booking_id uuid references public.bookings(id) on delete set null,
  related_roadside_request_id uuid references public.roadside_requests(id) on delete set null,
  related_vehicle_id uuid references public.vehicles(id) on delete set null,
  category text not null
    check (category in ('ride', 'roadside', 'payment', 'cash', 'safety', 'driver', 'customer', 'vehicle', 'documents', 'fleet', 'app', 'account', 'other')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open'
    check (status in ('open', 'waiting_for_support', 'waiting_for_user', 'in_review', 'resolved', 'closed', 'escalated')),
  subject text not null,
  description text not null,
  contact_preference text not null default 'in_app'
    check (contact_preference in ('in_app', 'phone', 'email')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null,
  attachment_url text,
  internal_note boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.support_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists support_tickets_created_by_idx on public.support_tickets(created_by);
create index if not exists support_tickets_assigned_to_idx on public.support_tickets(assigned_to);
create index if not exists support_tickets_status_idx on public.support_tickets(status);
create index if not exists support_tickets_category_idx on public.support_tickets(category);
create index if not exists support_messages_ticket_idx on public.support_messages(ticket_id, created_at);

alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_events enable row level security;

drop policy if exists "support_tickets_owner_or_admin_select" on public.support_tickets;
create policy "support_tickets_owner_or_admin_select"
on public.support_tickets for select
using (
  created_by = auth.uid()
  or assigned_to = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'fleet_manager')
  )
);

drop policy if exists "support_tickets_owner_insert" on public.support_tickets;
create policy "support_tickets_owner_insert"
on public.support_tickets for insert
with check (created_by = auth.uid());

drop policy if exists "support_tickets_owner_or_admin_update" on public.support_tickets;
create policy "support_tickets_owner_or_admin_update"
on public.support_tickets for update
using (
  created_by = auth.uid()
  or assigned_to = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'fleet_manager')
  )
)
with check (
  created_by = auth.uid()
  or assigned_to = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'fleet_manager')
  )
);

drop policy if exists "support_messages_ticket_select" on public.support_messages;
create policy "support_messages_ticket_select"
on public.support_messages for select
using (
  exists (
    select 1 from public.support_tickets t
    where t.id = support_messages.ticket_id
      and (
        t.created_by = auth.uid()
        or t.assigned_to = auth.uid()
        or exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.role in ('admin', 'fleet_manager')
        )
      )
  )
  and (
    internal_note = false
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'fleet_manager')
    )
  )
);

drop policy if exists "support_messages_ticket_insert" on public.support_messages;
create policy "support_messages_ticket_insert"
on public.support_messages for insert
with check (
  exists (
    select 1 from public.support_tickets t
    where t.id = support_messages.ticket_id
      and (
        t.created_by = auth.uid()
        or t.assigned_to = auth.uid()
        or exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.role in ('admin', 'fleet_manager')
        )
      )
  )
  and (sender_id = auth.uid() or sender_id is null)
);

drop policy if exists "support_events_owner_or_admin_select" on public.support_events;
create policy "support_events_owner_or_admin_select"
on public.support_events for select
using (
  exists (
    select 1 from public.support_tickets t
    where t.id = support_events.ticket_id
      and (
        t.created_by = auth.uid()
        or t.assigned_to = auth.uid()
        or exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.role in ('admin', 'fleet_manager')
        )
      )
  )
);

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public'
      and table_name = 'chat_threads'
  )
  and not exists (
    select 1 from pg_constraint
    where conname = 'chat_threads_support_ticket_id_fkey'
  ) then
    alter table public.chat_threads
      add constraint chat_threads_support_ticket_id_fkey
      foreign key (support_ticket_id) references public.support_tickets(id) on delete cascade;
  end if;

  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'support_messages'
     ) then
    alter publication supabase_realtime add table public.support_messages;
  end if;
end $$;
