import { AlertTriangle, Clock3, ShieldCheck, Truck } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Card } from "@/components/ui/card";
import { roadsideFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getRoadsideFleetStats } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideAnalyticsPage() {
  const stats = getRoadsideFleetStats();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Roadside fleet sections" items={roadsideFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Roadside analytics</p>
        <h1 className="mt-1 text-2xl font-semibold">Assistance KPIs</h1>
        <p className="mt-2 text-sm text-muted-foreground">Fast SLA, arrival confirmation, issue resolution and vehicle capability.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={Clock3} label="Average arrival" value={`${stats.averageArrivalMinutes} min`} />
        <MetricCard icon={AlertTriangle} label="Fast risk" value={stats.fastRequestsAtRisk} />
        <MetricCard icon={ShieldCheck} label="Guarantees applied" value={stats.guaranteesAppliedToday} />
        <MetricCard icon={Truck} label="Tow capacity" value={stats.activeTowTrucks} />
      </div>
      <Card className="rounded-3xl p-4">
        <h2 className="font-semibold">Revenue composition</h2>
        <div className="mt-4 space-y-4">
          <Bar label="Normal requests" value={stats.normalRequestsRevenue} total={stats.grossEarningsToday} />
          <Bar label="Fast requests" value={stats.fastRequestsRevenue} total={stats.grossEarningsToday} />
          <Bar label="Guarantee discounts" value={stats.guaranteeDiscountsApplied} total={stats.grossEarningsToday} />
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string | number }) {
  return (
    <Card className="rounded-3xl p-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </Card>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-muted-foreground">{formatCurrency(value)}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
