import { DriverVehicleCard } from "@/components/driver/DriverVehicleCard";
import { RoadsideVehicleEditor } from "@/components/roadside-operator/RoadsideVehicleEditor";
import { useAppStore } from "@/store/useAppStore";
import type { VehicleProfile } from "@/types/domain";

const defaultRoadsideVehicle: VehicleProfile = {
  id: "demo-roadside-vehicle",
  ownerRole: "roadside_operator",
  vehicleType: "tow_truck",
  plateNumber: "B103RID",
  capacityKg: 2500,
  color: "Galben",
  equipment: "troliu, booster baterie, compresor",
  serviceTypes: ["tractare", "pană", "baterie"],
  vehicleStatus: "active"
};

export function RoadsideVehiclesPage() {
  const vehicleProfile = useAppStore((state) => state.vehicleProfile);
  const vehicle = vehicleProfile?.ownerRole === "roadside_operator" ? vehicleProfile : defaultRoadsideVehicle;

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-24 md:pb-8">
      <div>
        <h1 className="text-2xl font-semibold">Vehicule intervenție</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestionează platforme, van-uri service și utilitare.</p>
      </div>
      <DriverVehicleCard vehicle={vehicle} />
      <RoadsideVehicleEditor vehicle={vehicle} />
    </div>
  );
}
