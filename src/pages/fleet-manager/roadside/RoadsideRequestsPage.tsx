import { AlertTriangle, Eye } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { roadsideFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getRoadsideRequests } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideRequestsPage() {
  const { toast } = useToast();
  const requests = getRoadsideRequests();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Roadside fleet sections" items={roadsideFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Roadside requests</p>
        <h1 className="mt-1 text-2xl font-semibold">Tow and assistance request queue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Includes arrivals, issue progress, solved confirmations and disputes.</p>
      </header>
      <Card className="rounded-3xl p-4">
        <div className="grid gap-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl bg-muted/55 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="block text-sm font-semibold">{request.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {request.customerLocation} · {request.issueType} · {formatCurrency(request.finalPriceRon)}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={request.speedTier === "fast" ? "warning" : "secondary"}>{request.speedTier}</Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Solicitare roadside deschisă",
                        description: `${request.label} este disponibilă pentru asignare și monitorizare în demo.`,
                        tone: "default"
                      })
                    }
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View request
                  </Button>
                  {request.status === "disputed" && <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />}
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">{request.status.replace(/_/g, " ")}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
