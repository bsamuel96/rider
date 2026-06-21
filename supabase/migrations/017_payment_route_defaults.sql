alter table public.bookings
  add column if not exists fare_estimate numeric,
  alter column payment_method set default 'cash',
  alter column cash_status set default 'pending_collection';

alter table public.roadside_requests
  alter column payment_method set default 'cash',
  alter column cash_status set default 'pending_collection';

update public.bookings
set cash_status = 'pending_collection'
where payment_method = 'cash'
  and cash_status = 'not_required';

update public.roadside_requests
set cash_status = 'pending_collection'
where payment_method = 'cash'
  and cash_status = 'not_required';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_payment_cash_state_check'
  ) then
    alter table public.bookings
      add constraint bookings_payment_cash_state_check
      check (
        (payment_method = 'cash' and cash_status in ('pending_collection', 'collected', 'disputed'))
        or (payment_method = 'card' and cash_status = 'not_required')
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'roadside_requests_payment_cash_state_check'
  ) then
    alter table public.roadside_requests
      add constraint roadside_requests_payment_cash_state_check
      check (
        (payment_method = 'cash' and cash_status in ('pending_collection', 'collected', 'disputed'))
        or (payment_method = 'card' and cash_status = 'not_required')
      );
  end if;
end $$;
