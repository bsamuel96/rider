import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Car, Clock3, Truck, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppSplashScreen } from "@/components/splash/AppSplashScreen";
import { demoFleetSummary } from "@/data/demoFleet";
import { useRoleSplash } from "@/hooks/useRoleSplash";
import { formatCurrency } from "@/utils/format";

export function FleetManagerDashboardPage() {
  const showSplash = useRoleSplash("fleet_manager");

  if (showSplash) {
    return <AppSplashScreen role="fleet_manager" />;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <p className="text-sm font-semibold text-primary">Fleet Manager</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">Două flote, control separat</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Transportul normal și roadside sunt urmărite separat, cu SLA rapid, confirmări client și vehicule dedicate.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <DomainCard
          title="Transport Fleet"
          description="Mașini standard/premium, șoferi, curse și încasări."
          icon={Car}
          href="/fleet-manager/transport"
          metrics={[
            { label: "Șoferi activi", value: demoFleetSummary.transport.activeDrivers },
            { label: "Mașini active", value: demoFleetSummary.transport.activeVehicles },
            { label: "Curse azi", value: demoFleetSummary.transport.ridesToday },
            { label: "Încasări", value: formatCurrency(demoFleetSummary.transport.earningsTodayRon) }
          ]}
        />
        <DomainCard
          title="Roadside Fleet"
          description="Platforme, vanuri service, operatori și garanția rapidă."
          icon={Truck}
          href="/fleet-manager/roadside"
          tone="warning"
          metrics={[
            { label: "Operatori activi", value: demoFleetSummary.roadside.activeOperators },
            { label: "Vehicule service", value: demoFleetSummary.roadside.serviceVehicles },
            { label: "Solicitări active", value: demoFleetSummary.roadside.activeRequests },
            { label: "Încasări", value: formatCurrency(demoFleetSummary.roadside.earningsTodayRon) }
          ]}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SignalCard icon={UsersRound} title="People" value="9 activi" body="Șoferi și operatori disponibili." />
        <SignalCard icon={Clock3} title="Roadside SLA" value="1 risc" body="Cerere Rapid aproape de garanția de 30 min." warning />
        <SignalCard icon={AlertTriangle} title="Confirmări" value="2 pending" body="Sosire și rezolvare așteaptă clientul." warning />
      </div>
    </div>
  );
}

type DomainCardProps = {
  title: string;
  description: string;
  href: string;
  icon: typeof Car;
  metrics: Array<{ label: string; value: string | number }>;
  tone?: "default" | "warning";
};

function DomainCard({ title, description, href, icon: Icon, metrics, tone = "default" }: DomainCardProps) {
  return (
    <Card className="glass-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        {tone === "warning" && <Badge variant="warning">SLA activ</Badge>}
      </div>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
      <Button asChild className="mt-5 w-full">
        <Link to={href}>
          Deschide
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </Card>
  );
}

type SignalCardProps = {
  title: string;
  value: string;
  body: string;
  icon: typeof UsersRound;
  warning?: boolean;
};

function SignalCard({ title, value, body, icon: Icon, warning }: SignalCardProps) {
  return (
    <Card className="rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      {warning && (
        <Badge variant="warning" className="mt-3">
          Necesită atenție
        </Badge>
      )}
    </Card>
  );
}
