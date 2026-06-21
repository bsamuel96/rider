import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { ProfileField } from "@/components/profile/ProfileField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/useAppStore";
import type { VehicleProfile } from "@/types/domain";
import { vehicleProfileSchema, type VehicleProfileValues } from "@/validation/profileSchemas";

type DriverVehicleEditorProps = {
  vehicle: VehicleProfile;
};

function vehicleDefaults(vehicle: VehicleProfile): VehicleProfileValues {
  return {
    brand: vehicle.brand || "",
    model: vehicle.model || "",
    productionYear: vehicle.productionYear || "",
    color: vehicle.color || "",
    plateNumber: vehicle.plateNumber || "",
    vehicleType: vehicle.vehicleType || "standard",
    seats: vehicle.seats || 4,
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

export function DriverVehicleEditor({ vehicle }: DriverVehicleEditorProps) {
  const updateVehicleProfile = useAppStore((state) => state.updateVehicleProfile);
  const [saved, setSaved] = useState(false);
  const defaultValues = useMemo(() => vehicleDefaults(vehicle), [vehicle]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<VehicleProfileValues>({
    resolver: zodResolver(vehicleProfileSchema),
    defaultValues
  });
  const watchedValues = watch();
  const criticalChanged =
    watchedValues.brand !== defaultValues.brand ||
    watchedValues.model !== defaultValues.model ||
    watchedValues.plateNumber !== defaultValues.plateNumber ||
    watchedValues.productionYear !== defaultValues.productionYear ||
    watchedValues.vehicleType !== defaultValues.vehicleType;

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
      vehicleStatus: vehicle.vehicleStatus === "active" && criticalChanged ? "pending_review" : vehicle.vehicleStatus
    };

    updateVehicleProfile(nextVehicle);
    reset(vehicleDefaults(nextVehicle));
    setSaved(true);
  });

  return (
    <Card className="glass-panel rounded-3xl p-5">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <h2 className="text-lg font-semibold">Editează vehiculul</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Culoarea, poza și notițele se pot schimba rapid. Datele critice pot cere reverificare.
          </p>
        </div>

        {criticalChanged && (
          <div className="flex items-start gap-2 rounded-2xl bg-amber-500/12 p-3 text-sm text-amber-700 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden="true" />
            Schimbările critice vor trimite vehiculul înapoi la verificare.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <ProfileField id="vehicle-brand" label="Brand" error={errors.brand?.message} inputProps={{ ...register("brand") }} />
          <ProfileField id="vehicle-model" label="Model" error={errors.model?.message} inputProps={{ ...register("model") }} />
          <ProfileField
            id="vehicle-year"
            label="An fabricație"
            error={errors.productionYear?.message}
            inputProps={{ type: "number", ...register("productionYear") }}
          />
          <ProfileField id="vehicle-color" label="Culoare" error={errors.color?.message} inputProps={{ ...register("color") }} />
          <ProfileField
            id="vehicle-plate"
            label="Număr înmatriculare"
            error={errors.plateNumber?.message}
            inputProps={{ ...register("plateNumber") }}
          />
          <ProfileField
            id="vehicle-type"
            label="Tip vehicul"
            error={errors.vehicleType?.message}
            inputProps={{ list: "driver-vehicle-types", ...register("vehicleType") }}
          />
          <ProfileField id="vehicle-seats" label="Locuri" error={errors.seats?.message} inputProps={{ type: "number", ...register("seats") }} />
          <ProfileField
            id="vehicle-fuel"
            label="Combustibil"
            error={errors.fuelType?.message}
            inputProps={{ ...register("fuelType") }}
          />
        </div>

        <datalist id="driver-vehicle-types">
          <option value="standard" />
          <option value="premium" />
        </datalist>

        <div className="space-y-2">
          <Label htmlFor="vehicle-notes">Notițe</Label>
          <Textarea id="vehicle-notes" className="rounded-2xl bg-background/70" {...register("notes")} />
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
