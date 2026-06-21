import { BarChart3, Banknote, Car, Clock3, Gauge, RadioTower, Route, Truck, UsersRound, Wrench } from "lucide-react";
import type { FleetSectionNavItem } from "@/components/fleet/FleetSectionNav";

export const transportFleetNavItems: FleetSectionNavItem[] = [
  { to: "/fleet-manager/transport", label: "Dashboard", icon: Gauge },
  { to: "/fleet-manager/transport/vehicles", label: "Vehicles", icon: Car },
  { to: "/fleet-manager/transport/drivers", label: "Drivers", icon: UsersRound },
  { to: "/fleet-manager/transport/rides", label: "Rides", icon: Route },
  { to: "/fleet-manager/transport/earnings", label: "Earnings", icon: Banknote },
  { to: "/fleet-manager/transport/analytics", label: "Analytics", icon: BarChart3 }
];

export const roadsideFleetNavItems: FleetSectionNavItem[] = [
  { to: "/fleet-manager/roadside", label: "Dashboard", icon: Gauge },
  { to: "/fleet-manager/roadside/vehicles", label: "Vehicles", icon: Truck },
  { to: "/fleet-manager/roadside/operators", label: "Operators", icon: Wrench },
  { to: "/fleet-manager/roadside/requests", label: "Requests", icon: RadioTower },
  { to: "/fleet-manager/roadside/fast-requests", label: "Fast SLA", icon: Clock3 },
  { to: "/fleet-manager/roadside/earnings", label: "Earnings", icon: Banknote },
  { to: "/fleet-manager/roadside/analytics", label: "Analytics", icon: BarChart3 }
];
