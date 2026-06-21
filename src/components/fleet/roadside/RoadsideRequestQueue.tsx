import { Eye, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/useToast";
import { getRoadsideRequests } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideRequestQueue() {
  const { toast } = useToast();
  const requests = getRoadsideRequests();

  return (
    <Card className="rounded-3xl p-4">
      <h2 className="font-semibold">Request Operations</h2>
      <p className="mt-1 text-sm text-muted-foreground">Tow, roadside, confirmations and disputes only.</p>
      <div className="mt-4 grid gap-3">
        {requests.length === 0 && (
          <EmptyState title="Nu există solicitări roadside" description="Intervențiile, tractările și confirmările clienților vor apărea aici." />
        )}
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl bg-muted/55 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <span className="block text-sm font-semibold">{request.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {request.customerLocation} · {request.issueType} · {formatCurrency(request.finalPriceRon)}
                </span>
              </span>
              <Badge variant={request.speedTier === "fast" ? "warning" : "secondary"}>
                {request.speedTier === "fast" ? "Rapid" : "Normal"}
              </Badge>
            </div>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">{request.status.replace(/_/g, " ")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Solicitare deschisă în demo",
                    description: `${request.label} este evidențiată în coada roadside.`,
                    tone: "default"
                  })
                }
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                View request
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Operator asignat în demo",
                    description: `${request.operatorName || "Cel mai apropiat operator"} a fost alocat solicitării.`,
                    tone: "success"
                  })
                }
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Assign operator
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
