import { Car, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { demoFleetVehicles, type DemoFleetVehicle } from "@/data/demoFleet";

export function FleetVehiclesPage() {
  const transportVehicles = demoFleetVehicles.filter((vehicle) => vehicle.fleetType === "transport");
  const roadsideVehicles = demoFleetVehicles.filter((vehicle) => vehicle.fleetType === "roadside");

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">Fleet vehicles</p>
        <h1 className="mt-1 text-2xl font-semibold">Transport and roadside separated</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Transport acceptă doar standard/premium cars. Roadside acceptă tow trucks, service vans și utility vehicles.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <VehicleGroup title="Transport vehicles" icon={Car} vehicles={transportVehicles} />
        <VehicleGroup title="Roadside vehicles" icon={Truck} vehicles={roadsideVehicles} />
      </div>
    </div>
  );
}

function VehicleGroup({ title, icon: Icon, vehicles }: { title: string; icon: typeof Car; vehicles: DemoFleetVehicle[] }) {
  return (
    <Card className="rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-4 grid gap-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="rounded-2xl bg-muted/55 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {vehicle.brand} {vehicle.model}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {vehicle.plateNumber} · {vehicle.service} · {vehicle.driverOrOperator}
                </p>
              </div>
              <Badge variant={vehicle.status === "active" ? "secondary" : "outline"}>{vehicle.status}</Badge>
            </div>
            <p className="mt-3 text-xs font-semibold text-primary">{formatVehicleKind(vehicle.vehicleKind)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function formatVehicleKind(kind: DemoFleetVehicle["vehicleKind"]) {
  const labels: Record<DemoFleetVehicle["vehicleKind"], string> = {
    standard_car: "Standard car",
    premium_car: "Premium car",
    tow_truck: "Tow truck",
    service_van: "Service van",
    utility_vehicle: "Utility vehicle"
  };

  return labels[kind];
}
