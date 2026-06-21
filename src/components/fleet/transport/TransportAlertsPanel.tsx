import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { getTransportAlerts } from "@/services/transportFleet";

export function TransportAlertsPanel() {
  const { toast } = useToast();
  const alerts = getTransportAlerts();

  return (
    <Card className="rounded-3xl p-4">
      <h2 className="font-semibold">Transport Alerts</h2>
      <p className="mt-1 text-sm text-muted-foreground">Ride-hailing alerts only: demand, drivers, cars, ride waits.</p>
      <div className="mt-4 grid gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl bg-muted/55 p-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-600">
                {alert.severity === "info" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <Badge variant={alert.severity === "info" ? "secondary" : "warning"}>{alert.severity}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{alert.body}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    toast({
                      title: "Alertă transport preluată",
                      description: `${alert.actionLabel} a fost simulat pentru ${alert.title}.`,
                      tone: alert.severity === "critical" ? "error" : "success"
                    })
                  }
                >
                  {alert.actionLabel}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
