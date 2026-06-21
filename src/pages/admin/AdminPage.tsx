import { BarChart3, Car, ClipboardList, LifeBuoy, Settings, Shield, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AppSplashScreen } from "@/components/splash/AppSplashScreen";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRoleSplash } from "@/hooks/useRoleSplash";

const sections = [
  { label: "Utilizatori", value: "12.480", icon: Users, to: "/admin/users" },
  { label: "Șoferi", value: "428", icon: Car, to: "/admin/drivers" },
  { label: "Vehicule", value: "512", icon: Truck, to: "/admin/vehicles" },
  { label: "Comenzi", value: "38.1k", icon: ClipboardList, to: "/admin/bookings" },
  { label: "Roadside", value: "1.204", icon: Shield, to: "/admin/roadside-requests" },
  { label: "Suport", value: "24", icon: LifeBuoy, to: "/admin/support" },
  { label: "Setări", value: "Active", icon: Settings, to: "/admin/settings" }
];

export function AdminPage() {
  const showSplash = useRoleSplash("admin");

  if (showSplash) {
    return <AppSplashScreen role="admin" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="secondary">Administrator</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Admin panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Dashboard, utilizatori, șoferi, vehicule, solicitări și statistici.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.label}
            to={section.to}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-floating active:scale-[0.98]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{section.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{section.value}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary">
                  <section.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Statistici operaționale</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Rată acceptare 92%", "ETA mediu 6 min", "Lighthouse țintă > 95"].map((metric) => (
            <div key={metric} className="rounded-lg border bg-background p-4 text-sm font-semibold">
              {metric}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
