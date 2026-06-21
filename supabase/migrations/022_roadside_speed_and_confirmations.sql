alter table public.roadside_requests
drop constraint if exists roadside_requests_status_check;

alter table public.roadside_requests
add constraint roadside_requests_status_check
check (
  status in (
    'draft',
    'searching',
    'accepted',
    'en_route',
    'arrived',
    'in_progress',
    'operator_en_route',
    'operator_arrived_pending_customer',
    'operator_arrived_confirmed',
    'issue_in_progress',
    'issue_solved_pending_customer',
    'issue_solved_confirmed',
    'completed',
    'cancelled',
    'disputed'
  )
);

alter table public.roadside_requests
add column if not exists speed_tier text not null default 'normal'
  check (speed_tier in ('normal', 'fast')),
add column if not exists normal_price numeric,
add column if not exists fast_price numeric,
add column if not exists final_price numeric,
add column if not exists fast_guarantee_deadline timestamptz,
add column if not exists fast_guarantee_applied boolean not null default false,
add column if not exists accepted_at timestamptz,
add column if not exists operator_en_route_at timestamptz,
add column if not exists operator_marked_arrived_at timestamptz,
add column if not exists customer_confirmed_arrived_at timestamptz,
add column if not exists operator_marked_solved_at timestamptz,
add column if not exists customer_confirmed_solved_at timestamptz,
add column if not exists completion_disputed_at timestamptz,
add column if not exists completion_dispute_reason text;

update public.roadside_requests
set
  normal_price = coalesce(normal_price, estimated_price),
  fast_price = coalesce(fast_price, round(estimated_price * 1.5)),
  final_price = coalesce(final_price, estimated_price)
where estimated_price is not null;

create index if not exists roadside_requests_speed_tier_idx
on public.roadside_requests(speed_tier);

create index if not exists roadside_requests_fast_deadline_idx
on public.roadside_requests(fast_guarantee_deadline)
where speed_tier = 'fast' and fast_guarantee_applied = false;
