import { Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getRoadsideFleetStats, getRoadsideVehicles } from "@/services/roadsideFleet";

export function RoadsideVehicleStatus() {
  const stats = getRoadsideFleetStats();
  const vehicles = getRoadsideVehicles();

  return (
    <Card className="rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Truck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">Roadside Vehicle Status</h2>
          <p className="text-sm text-muted-foreground">
            {stats.activeTowTrucks} tow trucks · {stats.activeServiceVans} service vans · {stats.vehiclesInMaintenance} maintenance
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="rounded-2xl bg-muted/55 p-3">
            <div className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold">
                  {vehicle.brand} {vehicle.model}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {vehicle.plateNumber} · {vehicle.vehicleType.replace(/_/g, " ")}
                </span>
              </span>
              <Badge variant={vehicle.status === "active" ? "secondary" : "outline"}>{vehicle.status}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{vehicle.equipment.join(", ")}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
