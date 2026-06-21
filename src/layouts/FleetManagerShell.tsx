import { BarChart3, Building2, Car, Gauge, Truck, UserRound, UsersRound } from "lucide-react";
import { RoleShellFrame, type RoleNavItem } from "@/layouts/RoleShellFrame";

const fleetManagerNavItems: RoleNavItem[] = [
  { to: "/fleet-manager", label: "Dashboard", icon: Gauge },
  { to: "/fleet-manager/transport", label: "Transport", icon: Car },
  { to: "/fleet-manager/roadside", label: "Roadside", icon: Truck },
  { to: "/fleet-manager/vehicles", label: "Vehicule", icon: Building2 },
  { to: "/fleet-manager/profile", label: "Profil", icon: UserRound },
  { to: "/fleet-manager/people", label: "People", icon: UsersRound },
  { to: "/fleet-manager/analytics", label: "Analytics", icon: BarChart3 }
];

export function FleetManagerShell() {
  return <RoleShellFrame portalLabel="Rider Fleet" homePath="/fleet-manager" navItems={fleetManagerNavItems} />;
}
