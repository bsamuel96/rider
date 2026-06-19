import { Banknote, Car, FileCheck2, Gauge, Route, UserRound } from "lucide-react";
import { RoleShellFrame, type RoleNavItem } from "@/layouts/RoleShellFrame";

const driverNavItems: RoleNavItem[] = [
  { to: "/driver", label: "Dashboard", icon: Gauge },
  { to: "/driver/rides", label: "Curse", icon: Route },
  { to: "/driver/earnings", label: "Câștiguri", icon: Banknote },
  { to: "/driver/vehicle", label: "Vehicul", icon: Car },
  { to: "/driver/profile", label: "Profil", icon: UserRound },
  { to: "/driver/documents", label: "Documente", icon: FileCheck2 }
];

export function DriverShell() {
  return <RoleShellFrame portalLabel="Rider Șofer" homePath="/driver" navItems={driverNavItems} mapFirst />;
}
