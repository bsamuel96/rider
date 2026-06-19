import { FileCheck2, Gauge, Map, RadioTower, Truck, UserRound, Wrench } from "lucide-react";
import { RoleShellFrame, type RoleNavItem } from "@/layouts/RoleShellFrame";

const roadsideNavItems: RoleNavItem[] = [
  { to: "/roadside-operator", label: "Dashboard", icon: Gauge },
  { to: "/roadside-operator/requests", label: "Solicitări", icon: RadioTower },
  { to: "/roadside-operator/fleet", label: "Fleet", icon: Wrench },
  { to: "/roadside-operator/vehicles", label: "Vehicule", icon: Truck },
  { to: "/roadside-operator/profile", label: "Profil", icon: UserRound },
  { to: "/roadside-operator/documents", label: "Documente", icon: FileCheck2 },
  { to: "/roadside-operator/requests", label: "Hartă", icon: Map }
];

export function RoadsideOperatorShell() {
  return <RoleShellFrame portalLabel="Rider Roadside" homePath="/roadside-operator" navItems={roadsideNavItems} />;
}
