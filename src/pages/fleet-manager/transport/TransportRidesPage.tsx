import { Route, UserPlus } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { transportFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getTransportRides } from "@/services/transportFleet";
import { formatCurrency } from "@/utils/format";

export function TransportRidesPage() {
  const { toast } = useToast();
  const rides = getTransportRides();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Transport fleet sections" items={transportFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Ride operations</p>
        <h1 className="mt-1 text-2xl font-semibold">Standard and Premium ride queue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Assign drivers, view live rides and watch ride wait times.</p>
      </header>
      <Card className="rounded-3xl p-4">
        <div className="grid gap-3">
          {rides.map((ride) => (
            <div key={ride.id} className="rounded-2xl bg-muted/55 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
                    <Route className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {ride.pickup} to {ride.destination}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {ride.serviceType} · {formatCurrency(ride.fareRon)} · waiting {ride.waitingMinutes} min
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ride.status === "searching_driver" ? "warning" : "secondary"}>{ride.status.replace(/_/g, " ")}</Badge>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Șofer asignat în demo",
                        description: `${ride.pickup} to ${ride.destination} a primit un șofer disponibil.`,
                        tone: "success"
                      })
                    }
                  >
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Assign driver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
