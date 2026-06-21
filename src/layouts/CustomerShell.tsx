import { Car, Clock3, Home, LifeBuoy, MapPinned, UserRound, Wrench } from "lucide-react";
import { RoleShellFrame, type RoleNavItem } from "@/layouts/RoleShellFrame";

const customerNavItems: RoleNavItem[] = [
  { to: "/customer", label: "Acasă", icon: Home },
  { to: "/customer/booking", label: "Cursă", icon: Car },
  { to: "/customer/roadside", label: "Roadside", icon: Wrench },
  { to: "/customer/history", label: "Istoric", icon: Clock3 },
  { to: "/customer/profile", label: "Profil", icon: UserRound },
  { to: "/customer/addresses", label: "Adrese", icon: MapPinned },
  { to: "/customer/support", label: "Suport", icon: LifeBuoy }
];

const customerMobileNavItems: RoleNavItem[] = [
  { to: "/customer", label: "Acasă", icon: Home },
  { to: "/customer/booking", label: "Cursă", icon: Car },
  { to: "/customer/roadside", label: "Roadside", icon: Wrench },
  { to: "/customer/history", label: "Istoric", icon: Clock3 },
  { to: "/customer/profile", label: "Profil", icon: UserRound }
];

export function CustomerShell() {
  return <RoleShellFrame portalLabel="Rider Client" homePath="/customer" navItems={customerNavItems} mobileNavItems={customerMobileNavItems} mapFirst />;
}
