import { Clock3, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RoadsideGuaranteeBanner } from "@/components/roadside/RoadsideGuaranteeBanner";
import { useToast } from "@/hooks/useToast";
import { getFastSlaRequests, getRoadsideFleetStats } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideFastSlaPanel() {
  const { toast } = useToast();
  const stats = getRoadsideFleetStats();
  const fastRequests = getFastSlaRequests();

  return (
    <Card className="rounded-3xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Fast Roadside SLA</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.fastRequestsWithinGuarantee} within guarantee · {stats.fastRequestsAtRisk} at risk · avg {stats.averageArrivalMinutes} min
          </p>
        </div>
        <Badge variant="warning">30 min</Badge>
      </div>
      <div className="mt-4 grid gap-3">
        {fastRequests.map((request) => (
          <div key={request.id} className="rounded-2xl bg-muted/55 p-3">
            <div className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold">{request.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {request.operatorName || "Nealocat"} · {formatCurrency(request.finalPriceRon)}
                </span>
              </span>
              <ShieldAlert className="h-5 w-5 text-amber-600" aria-hidden="true" />
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
                  title: request.guaranteeApplied ? "Garanția rapidă este aplicată" : "SLA rapid verificat",
                  description: request.guaranteeApplied
                    ? `${request.label} plătește tariful normal în demo.`
                    : `${request.label} mai are ${request.guaranteeMinutesLeft || 0} minute în garanție.`,
                  tone: request.guaranteeApplied ? "warning" : "success"
                })
              }
            >
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              View guarantee status
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
