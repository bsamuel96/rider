import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { ProfileField } from "@/components/profile/ProfileField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/useAppStore";
import type { VehicleProfile } from "@/types/domain";
import { vehicleProfileSchema, type VehicleProfileValues } from "@/validation/profileSchemas";

type RoadsideVehicleEditorProps = {
  vehicle: VehicleProfile;
};

function vehicleDefaults(vehicle: VehicleProfile): VehicleProfileValues {
  return {
    brand: vehicle.brand || "",
    model: vehicle.model || "",
    productionYear: vehicle.productionYear || "",
    color: vehicle.color || "",
    plateNumber: vehicle.plateNumber || "",
    vehicleType: vehicle.vehicleType || "tow_truck",
    seats: vehicle.seats || "",
    fuelType: vehicle.fuelType || "",
    capacityKg: vehicle.capacityKg || "",
    notes: vehicle.notes || "",
    equipment: vehicle.equipment || "",
    serviceTypes: vehicle.serviceTypes?.join(", ") || ""
  };
}

function optionalNumber(value: number | "" | undefined) {
  return value === "" ? undefined : value;
}

export function RoadsideVehicleEditor({ vehicle }: RoadsideVehicleEditorProps) {
  const updateVehicleProfile = useAppStore((state) => state.updateVehicleProfile);
  const [saved, setSaved] = useState(false);
  const defaultValues = useMemo(() => vehicleDefaults(vehicle), [vehicle]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<VehicleProfileValues>({
    resolver: zodResolver(vehicleProfileSchema),
    defaultValues
  });

  const submit = handleSubmit((values) => {
    const nextVehicle: VehicleProfile = {
      ...vehicle,
      brand: values.brand || undefined,
      model: values.model || undefined,
      productionYear: optionalNumber(values.productionYear),
      color: values.color || undefined,
      plateNumber: values.plateNumber,
      vehicleType: values.vehicleType,
      seats: optionalNumber(values.seats),
      fuelType: values.fuelType || undefined,
      capacityKg: optionalNumber(values.capacityKg),
      notes: values.notes || undefined,
      equipment: values.equipment || undefined,
      serviceTypes: values.serviceTypes ? values.serviceTypes.split(",").map((item) => item.trim()).filter(Boolean) : [],
      vehicleStatus: vehicle.vehicleStatus === "active" ? "pending_review" : vehicle.vehicleStatus
    };

    updateVehicleProfile(nextVehicle);
    reset(vehicleDefaults(nextVehicle));
    setSaved(true);
  });

  return (
    <Card className="glass-panel rounded-3xl p-5">
      <form className="space-y-4" onSubmit={submit}>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Truck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Vehicul intervenție</h2>
            <p className="mt-1 text-sm text-muted-foreground">Editează platforma, van-ul service sau vehiculul utilitar.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ProfileField
            id="roadside-vehicle-type"
            label="Tip vehicul"
            error={errors.vehicleType?.message}
            inputProps={{ list: "roadside-vehicle-types", ...register("vehicleType") }}
          />
          <ProfileField
            id="roadside-plate"
            label="Număr înmatriculare"
            error={errors.plateNumber?.message}
            inputProps={{ ...register("plateNumber") }}
          />
          <ProfileField
            id="roadside-capacity"
            label="Capacitate kg"
            error={errors.capacityKg?.message}
            inputProps={{ type: "number", ...register("capacityKg") }}
          />
          <ProfileField
            id="roadside-color"
            label="Culoare"
            error={errors.color?.message}
            inputProps={{ ...register("color") }}
          />
        </div>

        <datalist id="roadside-vehicle-types">
          <option value="tow_truck" />
          <option value="service_van" />
          <option value="utility" />
          <option value="motorcycle" />
        </datalist>

        <div className="space-y-2">
          <Label htmlFor="roadside-equipment">Echipamente</Label>
          <Textarea id="roadside-equipment" className="rounded-2xl bg-background/70" {...register("equipment")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roadside-service-types-editor">Servicii suportate</Label>
          <Textarea
            id="roadside-service-types-editor"
            className="rounded-2xl bg-background/70"
            placeholder="tractare, baterie, pană"
            {...register("serviceTypes")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roadside-notes">Notițe</Label>
          <Textarea id="roadside-notes" className="rounded-2xl bg-background/70" {...register("notes")} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {saved && (
            <p className="text-sm font-semibold text-primary" role="status">
              <Save className="mr-1 inline h-4 w-4" aria-hidden="true" />
              Vehicul salvat.
            </p>
          )}
          <Button type="submit" disabled={!isDirty || isSubmitting} className="sm:ml-auto">
            Salvează vehiculul
          </Button>
        </div>
      </form>
    </Card>
  );
}
