import { AlertTriangle, Car, Home, LifeBuoy, Truck, UserRound } from "lucide-react";
import { RoleShellFrame, type RoleNavItem } from "@/layouts/RoleShellFrame";

const fleetManagerNavItems: RoleNavItem[] = [
  { to: "/fleet-manager", label: "Home", icon: Home },
  { to: "/fleet-manager/transport", label: "Transport", icon: Car },
  { to: "/fleet-manager/roadside", label: "Roadside", icon: Truck },
  { to: "/fleet-manager/support", label: "Suport", icon: LifeBuoy },
  { to: "/fleet-manager/profile", label: "Profil", icon: UserRound }
];

const fleetManagerMobileNavItems: RoleNavItem[] = [
  { to: "/fleet-manager", label: "Home", icon: Home },
  { to: "/fleet-manager/transport", label: "Transport", icon: Car },
  { to: "/fleet-manager/roadside", label: "Roadside", icon: Truck },
  { to: "/fleet-manager/roadside/fast-requests", label: "Alerts", icon: AlertTriangle },
  { to: "/fleet-manager/profile", label: "Profil", icon: UserRound }
];

export function FleetManagerShell() {
  return (
    <RoleShellFrame
      portalLabel="Rider Fleet"
      homePath="/fleet-manager"
      navItems={fleetManagerNavItems}
      mobileNavItems={fleetManagerMobileNavItems}
    />
  );
}
