create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  roadside_request_id uuid references public.roadside_requests(id) on delete cascade,
  rater_id uuid not null references public.profiles(id) on delete cascade,
  ratee_id uuid not null references public.profiles(id) on delete cascade,
  rater_role text not null check (rater_role in ('client', 'driver', 'roadside_operator', 'admin')),
  ratee_role text not null check (ratee_role in ('client', 'driver', 'roadside_operator', 'admin')),
  rating integer not null check (rating between 1 and 5),
  tags text[] not null default '{}',
  comment text,
  created_at timestamptz not null default now(),
  constraint ratings_subject_check check (
    ((booking_id is not null)::int + (roadside_request_id is not null)::int) = 1
  )
);

create index if not exists ratings_booking_id_idx on public.ratings(booking_id);
create index if not exists ratings_roadside_request_id_idx on public.ratings(roadside_request_id);
create index if not exists ratings_rater_id_idx on public.ratings(rater_id);
create index if not exists ratings_ratee_id_idx on public.ratings(ratee_id);
create index if not exists ratings_created_at_idx on public.ratings(created_at desc);

alter table public.ratings enable row level security;

drop policy if exists "ratings_insert_own" on public.ratings;
drop policy if exists "ratings_select_related" on public.ratings;
drop policy if exists "ratings_admin_delete" on public.ratings;

create policy "ratings_insert_own"
  on public.ratings for insert
  with check (
    rater_id = auth.uid()
    and (
      public.current_role() = 'admin'
      or exists (
        select 1
        from public.bookings b
        where b.id = booking_id
          and (b.user_id = auth.uid() or b.driver_id = auth.uid())
          and b.status = 'completed'
      )
      or exists (
        select 1
        from public.roadside_requests r
        where r.id = roadside_request_id
          and (r.user_id = auth.uid() or r.operator_id = auth.uid())
          and r.status = 'completed'
      )
    )
  );

create policy "ratings_select_related"
  on public.ratings for select
  using (
    public.current_role() = 'admin'
    or rater_id = auth.uid()
    or ratee_id = auth.uid()
    or exists (
      select 1
      from public.bookings b
      where b.id = booking_id
        and (b.user_id = auth.uid() or b.driver_id = auth.uid())
    )
    or exists (
      select 1
      from public.roadside_requests r
      where r.id = roadside_request_id
        and (r.user_id = auth.uid() or r.operator_id = auth.uid())
    )
  );

create policy "ratings_admin_delete"
  on public.ratings for delete
  using (public.current_role() = 'admin');

do $$
begin
  alter publication supabase_realtime add table public.ratings;
exception when duplicate_object then null;
end $$;
