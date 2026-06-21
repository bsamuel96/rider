create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  roadside_request_id uuid references public.roadside_requests(id) on delete cascade,
  support_ticket_id uuid,
  thread_type text not null
    check (thread_type in ('ride', 'roadside', 'support')),
  status text not null default 'open'
    check (status in ('open', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_participants (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  participant_role text not null,
  last_read_at timestamptz,
  muted boolean not null default false,
  created_at timestamptz not null default now(),
  unique(thread_id, user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  message_type text not null default 'text'
    check (message_type in ('text', 'image', 'location', 'system', 'quick_reply')),
  body text,
  metadata jsonb not null default '{}',
  attachment_url text,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create index if not exists chat_threads_booking_id_idx on public.chat_threads(booking_id);
create index if not exists chat_threads_roadside_request_id_idx on public.chat_threads(roadside_request_id);
create index if not exists chat_threads_support_ticket_id_idx on public.chat_threads(support_ticket_id);
create index if not exists chat_messages_thread_created_idx on public.chat_messages(thread_id, created_at);
create index if not exists chat_participants_user_id_idx on public.chat_participants(user_id);

alter table public.chat_threads enable row level security;
alter table public.chat_participants enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat_threads_participant_select" on public.chat_threads;
create policy "chat_threads_participant_select"
on public.chat_threads for select
using (
  exists (
    select 1 from public.chat_participants cp
    where cp.thread_id = chat_threads.id
      and cp.user_id = auth.uid()
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "chat_threads_authenticated_insert" on public.chat_threads;
create policy "chat_threads_authenticated_insert"
on public.chat_threads for insert
with check (auth.uid() is not null);

drop policy if exists "chat_participants_thread_select" on public.chat_participants;
create policy "chat_participants_thread_select"
on public.chat_participants for select
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.chat_participants own
    where own.thread_id = chat_participants.thread_id
      and own.user_id = auth.uid()
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "chat_participants_self_update" on public.chat_participants;
create policy "chat_participants_self_update"
on public.chat_participants for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "chat_participants_authenticated_insert" on public.chat_participants;
create policy "chat_participants_authenticated_insert"
on public.chat_participants for insert
with check (
  auth.uid() is not null
  and (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
);

drop policy if exists "chat_messages_participant_select" on public.chat_messages;
create policy "chat_messages_participant_select"
on public.chat_messages for select
using (
  exists (
    select 1 from public.chat_participants cp
    where cp.thread_id = chat_messages.thread_id
      and cp.user_id = auth.uid()
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "chat_messages_participant_insert" on public.chat_messages;
create policy "chat_messages_participant_insert"
on public.chat_messages for insert
with check (
  exists (
    select 1 from public.chat_participants cp
    where cp.thread_id = chat_messages.thread_id
      and cp.user_id = auth.uid()
  )
  and (sender_id = auth.uid() or sender_id is null)
);

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'chat_messages'
     ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;
