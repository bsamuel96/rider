alter table public.bookings
  add column if not exists payment_method text not null default 'card',
  add column if not exists cash_status text not null default 'not_required',
  add column if not exists currency text not null default 'RON';

alter table public.roadside_requests
  add column if not exists payment_method text not null default 'card',
  add column if not exists cash_status text not null default 'not_required',
  add column if not exists currency text not null default 'RON',
  add column if not exists estimated_price numeric not null default 0;

update public.bookings
set
  payment_method = coalesce(payment_method, 'card'),
  cash_status = coalesce(cash_status, 'not_required'),
  currency = coalesce(currency, 'RON');

update public.roadside_requests
set
  payment_method = coalesce(payment_method, 'card'),
  cash_status = coalesce(cash_status, 'not_required'),
  currency = coalesce(currency, 'RON'),
  estimated_price = coalesce(estimated_price, 0);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_payment_method_check'
  ) then
    alter table public.bookings
      add constraint bookings_payment_method_check check (payment_method in ('cash', 'card'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_cash_status_check'
  ) then
    alter table public.bookings
      add constraint bookings_cash_status_check check (cash_status in ('not_required', 'pending_collection', 'collected', 'disputed'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_currency_check'
  ) then
    alter table public.bookings
      add constraint bookings_currency_check check (currency in ('RON'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'roadside_requests_payment_method_check'
  ) then
    alter table public.roadside_requests
      add constraint roadside_requests_payment_method_check check (payment_method in ('cash', 'card'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'roadside_requests_cash_status_check'
  ) then
    alter table public.roadside_requests
      add constraint roadside_requests_cash_status_check check (cash_status in ('not_required', 'pending_collection', 'collected', 'disputed'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'roadside_requests_currency_check'
  ) then
    alter table public.roadside_requests
      add constraint roadside_requests_currency_check check (currency in ('RON'));
  end if;
end $$;

create index if not exists bookings_payment_method_idx on public.bookings(payment_method);
create index if not exists bookings_cash_status_idx on public.bookings(cash_status);
create index if not exists roadside_requests_payment_method_idx on public.roadside_requests(payment_method);
create index if not exists roadside_requests_cash_status_idx on public.roadside_requests(cash_status);
