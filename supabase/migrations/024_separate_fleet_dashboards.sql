alter table public.profiles
add column if not exists fleet_scope text default 'both'
  check (fleet_scope in ('transport', 'roadside', 'both'));

alter table public.fleet_vehicles
add column if not exists fleet_type text,
add column if not exists vehicle_type text;

update public.fleet_vehicles fv
set fleet_type = f.fleet_type
from public.fleets f
where fv.fleet_id = f.id
  and fv.fleet_type is null;

update public.fleet_vehicles
set
  fleet_type = coalesce(fleet_type, 'transport'),
  vehicle_type = coalesce(vehicle_type, vehicle_kind);

alter table public.fleet_vehicles
alter column fleet_type set not null,
alter column vehicle_type set not null;

alter table public.fleet_vehicles
drop constraint if exists fleet_vehicles_fleet_type_check;

alter table public.fleet_vehicles
add constraint fleet_vehicles_fleet_type_check
check (fleet_type in ('transport', 'roadside'));

alter table public.fleet_vehicles
drop constraint if exists fleet_vehicles_vehicle_type_domain_check;

alter table public.fleet_vehicles
add constraint fleet_vehicles_vehicle_type_domain_check
check (
  (
    fleet_type = 'transport'
    and vehicle_type in ('standard_car', 'premium_car')
  )
  or (
    fleet_type = 'roadside'
    and vehicle_type in ('tow_truck', 'service_van', 'utility_vehicle', 'motorcycle')
  )
);

comment on column public.fleet_vehicles.vehicle_type is
  'Domain-specific vehicle type. Transport allows standard_car/premium_car. Roadside allows tow_truck/service_van/utility_vehicle/motorcycle.';

create or replace view public.transport_fleet_overview as
select
  f.id as fleet_id,
  f.name,
  count(fv.id) filter (where fv.status = 'active') as active_cars,
  count(fv.id) filter (where fv.vehicle_type = 'standard_car' and fv.status = 'active') as active_standard_cars,
  count(fv.id) filter (where fv.vehicle_type = 'premium_car' and fv.status = 'active') as active_premium_cars,
  count(fv.id) filter (where fv.status = 'maintenance') as vehicles_in_maintenance,
  count(fv.id) filter (where fv.status = 'pending_review') as vehicles_pending_review
from public.fleets f
left join public.fleet_vehicles fv on fv.fleet_id = f.id
where f.fleet_type = 'transport'
group by f.id, f.name;

create or replace view public.roadside_fleet_overview as
select
  f.id as fleet_id,
  f.name,
  count(fv.id) filter (where fv.vehicle_type = 'tow_truck' and fv.status = 'active') as active_tow_trucks,
  count(fv.id) filter (where fv.vehicle_type = 'service_van' and fv.status = 'active') as active_service_vans,
  count(fv.id) filter (where fv.vehicle_type = 'utility_vehicle' and fv.status = 'active') as active_utility_vehicles,
  count(fv.id) filter (where fv.vehicle_type = 'motorcycle' and fv.status = 'active') as active_motorcycles,
  count(fv.id) filter (where fv.status = 'maintenance') as vehicles_in_maintenance,
  count(fv.id) filter (where fv.status = 'pending_review') as vehicles_pending_review
from public.fleets f
left join public.fleet_vehicles fv on fv.fleet_id = f.id
where f.fleet_type = 'roadside'
group by f.id, f.name;
