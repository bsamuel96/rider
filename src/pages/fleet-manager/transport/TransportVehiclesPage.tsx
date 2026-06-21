import { Car, Wrench } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { transportFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getTransportVehicles } from "@/services/transportFleet";

export function TransportVehiclesPage() {
  const { toast } = useToast();
  const vehicles = getTransportVehicles();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Transport fleet sections" items={transportFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Transport vehicles</p>
        <h1 className="mt-1 text-2xl font-semibold">Standard and Premium cars</h1>
        <p className="mt-2 text-sm text-muted-foreground">No tow trucks or service vans here. Only cars used for ride-hailing.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="rounded-3xl p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Car className="h-5 w-5" aria-hidden="true" />
              </span>
              <Badge variant={vehicle.status === "active" ? "secondary" : "outline"}>{vehicle.status}</Badge>
            </div>
            <h2 className="mt-4 font-semibold">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle.plateNumber} · {vehicle.vehicleType.replace("_", " ")} · {vehicle.driverName}
            </p>
            <p className="mt-3 text-xs font-semibold text-primary">Documents expire in {vehicle.documentsExpireInDays} days</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() =>
                toast({
                  title: "Mentenanță demo programată",
                  description: `${vehicle.plateNumber} a fost marcat pentru verificare.`,
                  tone: "warning"
                })
              }
            >
              <Wrench className="h-4 w-4" aria-hidden="true" />
              Mark vehicle maintenance
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
