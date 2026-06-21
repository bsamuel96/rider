import { Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getRoadsideFleetStats, getRoadsideOperators } from "@/services/roadsideFleet";

export function RoadsideOperatorAvailability() {
  const stats = getRoadsideFleetStats();
  const operators = getRoadsideOperators();

  return (
    <Card className="rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Wrench className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">Operator Availability</h2>
          <p className="text-sm text-muted-foreground">
            {stats.onlineOperators} online · {stats.busyOperators} busy · {stats.offlineOperators} offline
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {operators.length === 0 && (
          <EmptyState title="Nu există operatori activi" description="Operatorii roadside apar aici după ce sunt aprobați sau importați." />
        )}
        {operators.map((operator) => (
          <div key={operator.id} className="flex items-center justify-between gap-3 rounded-2xl bg-muted/55 p-3">
            <span>
              <span className="block text-sm font-semibold">{operator.name}</span>
              <span className="block text-xs text-muted-foreground">{operator.serviceTypes.join(", ")}</span>
            </span>
            <Badge variant={operator.status === "online" ? "secondary" : operator.status === "busy" ? "default" : "outline"}>
              {operator.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
