alter table public.addresses
add column if not exists source text default 'search'
  check (source in ('search', 'current_location', 'map_pin', 'recent', 'favorite')),
add column if not exists accuracy_meters numeric,
add column if not exists raw_address jsonb;
