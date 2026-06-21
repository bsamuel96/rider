import { Truck } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { roadsideFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getRoadsideVehicles } from "@/services/roadsideFleet";

export function RoadsideVehiclesPage() {
  const vehicles = getRoadsideVehicles();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Roadside fleet sections" items={roadsideFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Roadside vehicles</p>
        <h1 className="mt-1 text-2xl font-semibold">Tow trucks, service vans, utility vehicles</h1>
        <p className="mt-2 text-sm text-muted-foreground">No standard or premium ride cars here. These vehicles support interventions.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="rounded-3xl p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </span>
              <Badge variant={vehicle.status === "active" ? "secondary" : "outline"}>{vehicle.status}</Badge>
            </div>
            <h2 className="mt-4 font-semibold">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle.plateNumber} · {vehicle.vehicleType.replace(/_/g, " ")} · {vehicle.operatorName}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">{vehicle.equipment.join(", ")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
