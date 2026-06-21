import { Car } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VehicleDocumentStatus } from "@/components/driver/VehicleDocumentStatus";
import type { VehicleProfile } from "@/types/domain";

type DriverVehicleCardProps = {
  vehicle: VehicleProfile;
};

export function DriverVehicleCard({ vehicle }: DriverVehicleCardProps) {
  return (
    <Card className="glass-panel rounded-3xl p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Car className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">
            {vehicle.brand || "Vehicul"} {vehicle.model || ""}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {vehicle.plateNumber || "Număr necompletat"} · {vehicle.vehicleType} · {vehicle.seats || 4} locuri
          </p>
          <div className="mt-3">
            <VehicleDocumentStatus status={vehicle.vehicleStatus} />
          </div>
        </div>
      </div>
    </Card>
  );
}
