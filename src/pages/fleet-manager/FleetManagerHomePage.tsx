import { Link } from "react-router-dom";
import { ArrowRight, Car, LifeBuoy, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppSplashScreen } from "@/components/splash/AppSplashScreen";
import { useRoleSplash } from "@/hooks/useRoleSplash";
import { getRoadsideFleetStats } from "@/services/roadsideFleet";
import { getTransportFleetStats } from "@/services/transportFleet";

export function FleetManagerHomePage() {
  const showSplash = useRoleSplash("fleet_manager");
  const transport = getTransportFleetStats();
  const roadside = getRoadsideFleetStats();

  if (showSplash) {
    return <AppSplashScreen role="fleet_manager" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">Fleet Manager</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">Alege sistemul de flotă</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Transportul și roadside sunt produse operaționale separate. Intră în dashboardul potrivit pentru KPI-uri, hărți, echipe și alerte dedicate.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <SelectorCard
          title="Transport Fleet"
          subtitle="Curse standard și premium"
          href="/fleet-manager/transport"
          buttonLabel="Deschide Transport"
          icon={Car}
          stats={[
            { label: "active drivers", value: transport.onlineDrivers },
            { label: "active cars", value: transport.activeCars },
            { label: "rides in progress", value: transport.ridesInProgress },
            { label: "rides today", value: transport.ridesToday }
          ]}
        />
        <SelectorCard
          title="Roadside Assistance Fleet"
          subtitle="Tractări și intervenții rutiere"
          href="/fleet-manager/roadside"
          buttonLabel="Deschide Roadside"
          icon={Truck}
          tone="roadside"
          stats={[
            { label: "active operators", value: roadside.onlineOperators },
            { label: "tow/service vehicles", value: roadside.activeTowTrucks + roadside.activeServiceVans },
            { label: "requests in progress", value: roadside.activeRequests },
            { label: "fast requests at risk", value: roadside.fastRequestsAtRisk }
          ]}
        />
      </div>

      <Card className="rounded-3xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Global overview</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Folosește această pagină doar ca selector. Dashboardurile complete sunt separate în Transport și Roadside.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/fleet-manager/support">
              <LifeBuoy className="h-4 w-4" aria-hidden="true" />
              Suport fleet
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

type SelectorCardProps = {
  title: string;
  subtitle: string;
  href: string;
  buttonLabel: string;
  icon: typeof Car;
  stats: Array<{ label: string; value: string | number }>;
  tone?: "transport" | "roadside";
};

function SelectorCard({ title, subtitle, href, buttonLabel, icon: Icon, stats, tone = "transport" }: SelectorCardProps) {
  return (
    <Card className="glass-panel rounded-3xl p-5">
      <span className={tone === "roadside" ? "grid h-14 w-14 place-items-center rounded-3xl bg-amber-500/14 text-amber-700 dark:text-amber-300" : "grid h-14 w-14 place-items-center rounded-3xl bg-primary/12 text-primary"}>
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
      <Button asChild className="mt-5 w-full">
        <Link to={href}>
          {buttonLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </Card>
  );
}
