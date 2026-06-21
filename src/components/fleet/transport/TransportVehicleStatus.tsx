import { Car, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { getTransportFleetStats, getTransportVehicles } from "@/services/transportFleet";

export function TransportVehicleStatus() {
  const { toast } = useToast();
  const stats = getTransportFleetStats();
  const vehicles = getTransportVehicles();

  return (
    <Card className="rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Car className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">Vehicle Status</h2>
          <p className="text-sm text-muted-foreground">
            {stats.activeStandardCars} standard · {stats.activePremiumCars} premium · {stats.vehiclesInMaintenance} maintenance
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex flex-col gap-3 rounded-2xl bg-muted/55 p-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="block text-sm font-semibold">
                {vehicle.brand} {vehicle.model}
              </span>
              <span className="block text-xs text-muted-foreground">
                {vehicle.plateNumber} · {vehicle.vehicleType.replace("_", " ")} · docs {vehicle.documentsExpireInDays} zile
              </span>
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={vehicle.status === "active" ? "secondary" : "outline"}>{vehicle.status}</Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Vehicul marcat pentru mentenanță",
                    description: `${vehicle.plateNumber} a fost trimis în coada demo de service.`,
                    tone: "warning"
                  })
                }
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                Maintenance
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
