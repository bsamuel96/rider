import { Car, ClipboardCheck, Gauge, Settings, ShieldCheck, Truck, Users } from "lucide-react";
import { RoleShellFrame, type RoleNavItem } from "@/layouts/RoleShellFrame";

const adminNavItems: RoleNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: Gauge },
  { to: "/admin/users", label: "Utilizatori", icon: Users },
  { to: "/admin/approvals", label: "Aprobări", icon: ClipboardCheck },
  { to: "/admin/bookings", label: "Curse", icon: Car },
  { to: "/admin/roadside-requests", label: "Roadside", icon: ShieldCheck },
  { to: "/admin/vehicles", label: "Fleet", icon: Truck },
  { to: "/admin/settings", label: "Setări", icon: Settings }
];

export function AdminShell() {
  return <RoleShellFrame portalLabel="Rider Admin" homePath="/admin" profilePath="/admin/users" navItems={adminNavItems} />;
}
