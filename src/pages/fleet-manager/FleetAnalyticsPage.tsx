import { AlertTriangle, Banknote, BarChart3, Clock3, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { demoFleetJobs, demoFleetSummary } from "@/data/demoFleet";
import { formatCurrency } from "@/utils/format";

export function FleetAnalyticsPage() {
  const transportEarnings = demoFleetSummary.transport.earningsTodayRon;
  const roadsideEarnings = demoFleetSummary.roadside.earningsTodayRon;
  const total = transportEarnings + roadsideEarnings;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">Fleet analytics</p>
        <h1 className="mt-1 text-2xl font-semibold">Operational pulse</h1>
        <p className="mt-2 text-sm text-muted-foreground">Metrici demo pentru transport și roadside, păstrate ca domenii separate.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={Banknote} label="Total azi" value={formatCurrency(total)} />
        <MetricCard icon={Route} label="Curse transport" value={demoFleetSummary.transport.ridesToday} />
        <MetricCard icon={Clock3} label="Roadside active" value={demoFleetSummary.roadside.activeRequests} />
        <MetricCard icon={AlertTriangle} label="SLA risc" value={demoFleetSummary.roadside.fastSlaRisk} warning />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Revenue by domain</h2>
          <div className="mt-4 space-y-4">
            <Bar label="Transport" value={transportEarnings} total={total} />
            <Bar label="Roadside" value={roadsideEarnings} total={total} />
          </div>
        </Card>
        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Jobs needing attention</h2>
          <div className="mt-3 grid gap-3">
            {demoFleetJobs
              .filter((job) => job.fleetType === "roadside")
              .map((job) => (
                <div key={job.id} className="rounded-2xl bg-muted/55 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{job.label}</p>
                    <Badge variant={job.speedTier === "fast" ? "warning" : "secondary"}>{job.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.assignee} · {formatCurrency(job.valueRon)}
                  </p>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, warning }: { icon: typeof BarChart3; label: string; value: string | number; warning?: boolean }) {
  return (
    <Card className="rounded-3xl p-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      {warning && (
        <Badge variant="warning" className="mt-2">
          Atenție
        </Badge>
      )}
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
      <p className="mt-1 text-xs text-muted-foreground">{percentage}% din total</p>
    </div>
  );
}
