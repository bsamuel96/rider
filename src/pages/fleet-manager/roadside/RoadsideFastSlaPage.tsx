import { Clock3, ShieldAlert } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { RoadsideGuaranteeBanner } from "@/components/roadside/RoadsideGuaranteeBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { roadsideFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getFastSlaRequests, getRoadsideFleetStats } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideFastSlaPage() {
  const { toast } = useToast();
  const stats = getRoadsideFleetStats();
  const requests = getFastSlaRequests();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Roadside fleet sections" items={roadsideFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Fast SLA monitoring</p>
        <h1 className="mt-1 text-2xl font-semibold">30-minute guarantee</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Rapid roadside requests, timers, missed guarantees and discount exposure.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="Fast active" value={stats.fastRequestsActive} />
        <Metric label="Within guarantee" value={stats.fastRequestsWithinGuarantee} />
        <Metric label="At risk" value={stats.fastRequestsAtRisk} warning />
        <Metric label="Applied today" value={stats.guaranteesAppliedToday} />
      </div>
      <Card className="rounded-3xl p-4">
        <div className="grid gap-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl bg-muted/55 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="block text-sm font-semibold">{request.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {request.customerLocation} · {request.operatorName || "Nealocat"} · {formatCurrency(request.finalPriceRon)}
                  </span>
                </span>
                <Badge variant="warning">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  Rapid
                </Badge>
              </div>
              <div className="mt-3">
                <RoadsideGuaranteeBanner
                  status={request.guaranteeApplied ? "applied" : "active"}
                  remainingMinutes={request.guaranteeMinutesLeft || 0}
                  operatorView
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() =>
                  toast({
                    title: request.guaranteeApplied ? "Garanție aplicată" : "SLA rapid verificat",
                    description: request.guaranteeApplied
                      ? `${request.label} a revenit la tariful normal.`
                      : `${request.label} este urmărit în fereastra de 30 de minute.`,
                    tone: request.guaranteeApplied ? "warning" : "success"
                  })
                }
              >
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                View guarantee status
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, warning }: { label: string; value: string | number; warning?: boolean }) {
  return (
    <Card className="rounded-3xl p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {warning && (
        <Badge variant="warning" className="mt-2">
          Atenție
        </Badge>
      )}
    </Card>
  );
}
