import { BarChart3, Car, Route, UsersRound } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Card } from "@/components/ui/card";
import { transportFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getTransportFleetStats } from "@/services/transportFleet";
import { formatCurrency } from "@/utils/format";

export function TransportAnalyticsPage() {
  const stats = getTransportFleetStats();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Transport fleet sections" items={transportFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Transport analytics</p>
        <h1 className="mt-1 text-2xl font-semibold">Ride-hailing KPIs</h1>
        <p className="mt-2 text-sm text-muted-foreground">Demand, driver supply, vehicle readiness and transport revenue.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard icon={UsersRound} label="Driver utilization" value="71%" />
        <MetricCard icon={Car} label="Vehicle readiness" value="82%" />
        <MetricCard icon={Route} label="Completion rate" value="91%" />
      </div>
      <Card className="rounded-3xl p-4">
        <h2 className="font-semibold">Revenue composition</h2>
        <div className="mt-4 space-y-4">
          <Bar label="Cash rides" value={stats.cashEarningsToday} total={stats.grossEarningsToday} />
          <Bar label="Card rides" value={stats.cardEarningsToday} total={stats.grossEarningsToday} />
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof BarChart3; label: string; value: string }) {
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
        <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
