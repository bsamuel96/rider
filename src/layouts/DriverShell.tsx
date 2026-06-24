import { Banknote, CalendarClock, Car, FileCheck2, Gauge, Gift, LifeBuoy, Route, UserRound } from "lucide-react";
import { RoleShellFrame, type RoleNavItem } from "@/layouts/RoleShellFrame";

const driverNavItems: RoleNavItem[] = [
  { to: "/driver", label: "Dashboard", icon: Gauge },
  { to: "/driver/campaigns", label: "Campanii", icon: Gift },
  { to: "/driver/scheduled", label: "Programate", icon: CalendarClock },
  { to: "/driver/rides", label: "Curse", icon: Route },
  { to: "/driver/earnings", label: "Câștiguri", icon: Banknote },
  { to: "/driver/vehicle", label: "Vehicul", icon: Car },
  { to: "/driver/profile", label: "Profil", icon: UserRound },
  { to: "/driver/documents", label: "Documente", icon: FileCheck2 },
  { to: "/driver/support", label: "Suport", icon: LifeBuoy }
];

const driverMobileNavItems: RoleNavItem[] = [
  { to: "/driver", label: "Acasă", icon: Gauge },
  { to: "/driver/campaigns", label: "Câștigă", icon: Gift },
  { to: "/driver/rides", label: "Curse", icon: Route },
  { to: "/driver/support", label: "Ajutor", icon: LifeBuoy },
  { to: "/driver/profile", label: "Profil", icon: UserRound }
];

export function DriverShell() {
  return <RoleShellFrame portalLabel="Rider Șofer" homePath="/driver" navItems={driverNavItems} mobileNavItems={driverMobileNavItems} mapFirst />;
}
