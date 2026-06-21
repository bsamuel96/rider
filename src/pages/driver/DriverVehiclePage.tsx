import { DriverVehicleCard } from "@/components/driver/DriverVehicleCard";
import { DriverVehicleEditor } from "@/components/driver/DriverVehicleEditor";
import { useAppStore } from "@/store/useAppStore";
import type { VehicleProfile } from "@/types/domain";

const defaultDriverVehicle: VehicleProfile = {
  id: "demo-driver-vehicle",
  ownerRole: "driver",
  vehicleType: "standard",
  brand: "Dacia",
  model: "Jogger",
  plateNumber: "B101RID",
  color: "Alb",
  productionYear: 2022,
  seats: 4,
  fuelType: "benzină",
  vehicleStatus: "active"
};

export function DriverVehiclePage() {
  const vehicleProfile = useAppStore((state) => state.vehicleProfile);
  const vehicle = vehicleProfile?.ownerRole === "driver" ? vehicleProfile : defaultDriverVehicle;

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-24 md:pb-8">
      <div>
        <h1 className="text-2xl font-semibold">Vehicul activ</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestionează vehiculul folosit pentru curse.</p>
      </div>
      <DriverVehicleCard vehicle={vehicle} />
      <DriverVehicleEditor vehicle={vehicle} />
    </div>
  );
}
