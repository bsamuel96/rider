import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, FileCheck2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpCustomer, signUpDriver, signUpRoadsideOperator } from "@/services/auth";
import { getDashboardPathForRole } from "@/services/roleRedirect";
import type { AuthInstance } from "@/types/domain";
import {
  customerRegisterSchema,
  driverRegisterSchema,
  roadsideRegisterSchema,
  type CustomerRegisterValues,
  type DriverRegisterValues,
  type RoadsideRegisterValues
} from "@/validation/authSchemas";
import { cn } from "@/utils/cn";

type RegisterFormProps = {
  instance: AuthInstance;
};

type RegisterFormFields = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  primaryAddress?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  experienceYears?: number;
  mainCity?: string;
  serviceRegion?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  productionYear?: number;
  plateNumber?: string;
  vehicleColor?: string;
  vehicleType?: "standard" | "premium";
  seats?: number;
  companyName?: string;
  fiscalCode?: string;
  contactPerson?: string;
  dispatcherPhone?: string;
  companyEmail?: string;
  serviceRegions?: string;
  serviceTypes: string[];
  interventionVehicleType?: "tow_truck" | "service_van" | "motorcycle" | "utility";
  interventionPlateNumber?: string;
  towingCapacity?: number;
  equipment?: string;
};

const defaultValues: RegisterFormFields = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  primaryAddress: "",
  licenseNumber: "",
  licenseExpiry: "",
  experienceYears: 0,
  mainCity: "",
  serviceRegion: "",
  vehicleBrand: "",
  vehicleModel: "",
  productionYear: 2022,
  plateNumber: "",
  vehicleColor: "",
  vehicleType: "standard",
  seats: 4,
  companyName: "",
  fiscalCode: "",
  contactPerson: "",
  dispatcherPhone: "",
  companyEmail: "",
  serviceRegions: "",
  serviceTypes: ["Tractare"],
  interventionVehicleType: "tow_truck",
  interventionPlateNumber: "",
  towingCapacity: 1500,
  equipment: ""
};

const serviceTypeOptions = [
  "Tractare",
  "Pornire baterie",
  "Pană",
  "Alimentare combustibil",
  "Deblocare auto",
  "Transport vehicul",
  "Accident",
  "Mecanică rapidă"
];

const registerSchema: Record<AuthInstance, z.ZodType> = {
  customer: customerRegisterSchema,
  driver: driverRegisterSchema,
  roadside: roadsideRegisterSchema
};

const submitText: Record<AuthInstance, string> = {
  customer: "Continuă ca client",
  driver: "Continuă ca șofer",
  roadside: "Continuă pentru tractare și asistență"
};

export function RegisterForm({ instance }: RegisterFormProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const schema = useMemo(() => registerSchema[instance], [instance]);
  const form = useForm<RegisterFormFields>({
    resolver: zodResolver(schema) as Resolver<RegisterFormFields>,
    defaultValues
  });
  const selectedServices = form.watch("serviceTypes");

  const toggleService = (service: string) => {
    const nextServices = selectedServices.includes(service)
      ? selectedServices.filter((item) => item !== service)
      : [...selectedServices, service];
    form.setValue("serviceTypes", nextServices, { shouldValidate: true });
  };

  const submit = async (values: RegisterFormFields) => {
    setError(null);

    try {
      const profile =
        instance === "customer"
          ? await signUpCustomer(values as unknown as CustomerRegisterValues)
          : instance === "driver"
            ? await signUpDriver(values as unknown as DriverRegisterValues)
            : await signUpRoadsideOperator(values as unknown as RoadsideRegisterValues);

      navigate(instance === "customer" ? "/onboarding" : getDashboardPathForRole(profile));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Înregistrarea nu a reușit.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
      <section className="grid gap-3 sm:grid-cols-2">
        <Field label="Nume complet" error={form.formState.errors.fullName?.message}>
          <Input placeholder="Nume Prenume" {...form.register("fullName")} />
        </Field>
        <Field label="Username" error={form.formState.errors.username?.message}>
          <Input placeholder="rider_user" {...form.register("username")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="email@rider.ro" {...form.register("email")} />
        </Field>
        <Field label="Telefon" error={form.formState.errors.phone?.message}>
          <Input type="tel" placeholder="+40 700 000 000" {...form.register("phone")} />
        </Field>
        <Field label="Parolă" error={form.formState.errors.password?.message}>
          <Input type="password" placeholder="minimum 8 caractere" {...form.register("password")} />
        </Field>
        <Field label="Confirmare parolă" error={form.formState.errors.confirmPassword?.message}>
          <Input type="password" placeholder="repetă parola" {...form.register("confirmPassword")} />
        </Field>
      </section>

      {instance === "customer" && (
        <Field label="Adresă principală opțională" error={form.formState.errors.primaryAddress?.message}>
          <Input placeholder="Stradă, număr, oraș" {...form.register("primaryAddress")} />
        </Field>
      )}

      {instance === "driver" && (
        <>
          <SectionTitle title="Date șofer" />
          <section className="grid gap-3 sm:grid-cols-2">
            <Field label="Număr permis" error={form.formState.errors.licenseNumber?.message}>
              <Input {...form.register("licenseNumber")} />
            </Field>
            <Field label="Expirare permis" error={form.formState.errors.licenseExpiry?.message}>
              <Input type="date" {...form.register("licenseExpiry")} />
            </Field>
            <Field label="Ani experiență" error={form.formState.errors.experienceYears?.message}>
              <Input type="number" min={0} {...form.register("experienceYears")} />
            </Field>
            <Field label="Oraș principal" error={form.formState.errors.mainCity?.message}>
              <Input {...form.register("mainCity")} />
            </Field>
            <Field label="Județ / regiune" error={form.formState.errors.serviceRegion?.message}>
              <Input {...form.register("serviceRegion")} />
            </Field>
          </section>

          <SectionTitle title="Date vehicul" />
          <section className="grid gap-3 sm:grid-cols-2">
            <Field label="Marcă" error={form.formState.errors.vehicleBrand?.message}>
              <Input {...form.register("vehicleBrand")} />
            </Field>
            <Field label="Model" error={form.formState.errors.vehicleModel?.message}>
              <Input {...form.register("vehicleModel")} />
            </Field>
            <Field label="An fabricație" error={form.formState.errors.productionYear?.message}>
              <Input type="number" {...form.register("productionYear")} />
            </Field>
            <Field label="Număr înmatriculare" error={form.formState.errors.plateNumber?.message}>
              <Input {...form.register("plateNumber")} />
            </Field>
            <Field label="Culoare" error={form.formState.errors.vehicleColor?.message}>
              <Input {...form.register("vehicleColor")} />
            </Field>
            <Field label="Număr locuri" error={form.formState.errors.seats?.message}>
              <Input type="number" min={1} {...form.register("seats")} />
            </Field>
          </section>
          <RadioGrid
            label="Tip vehicul"
            values={[
              ["standard", "Standard"],
              ["premium", "Premium"]
            ]}
            active={form.watch("vehicleType") || "standard"}
            onChange={(value) => form.setValue("vehicleType", value as "standard" | "premium")}
          />
          <DocumentDropzone label="Documente șofer și vehicul" />
        </>
      )}

      {instance === "roadside" && (
        <>
          <SectionTitle title="Date companie / operator" />
          <section className="grid gap-3 sm:grid-cols-2">
            <Field label="Nume companie" error={form.formState.errors.companyName?.message}>
              <Input {...form.register("companyName")} />
            </Field>
            <Field label="CUI / cod fiscal" error={form.formState.errors.fiscalCode?.message}>
              <Input {...form.register("fiscalCode")} />
            </Field>
            <Field label="Persoană contact" error={form.formState.errors.contactPerson?.message}>
              <Input {...form.register("contactPerson")} />
            </Field>
            <Field label="Telefon dispecerat" error={form.formState.errors.dispatcherPhone?.message}>
              <Input type="tel" {...form.register("dispatcherPhone")} />
            </Field>
            <Field label="Email companie" error={form.formState.errors.companyEmail?.message}>
              <Input type="email" {...form.register("companyEmail")} />
            </Field>
            <Field label="Oraș principal" error={form.formState.errors.mainCity?.message}>
              <Input {...form.register("mainCity")} />
            </Field>
          </section>
          <Field label="Regiuni acoperite" error={form.formState.errors.serviceRegions?.message}>
            <Input placeholder="București, Ilfov, Prahova" {...form.register("serviceRegions")} />
          </Field>

          <SectionTitle title="Tip servicii" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {serviceTypeOptions.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={cn(
                  "min-h-11 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selectedServices.includes(service) ? "border-primary bg-primary text-primary-foreground" : "bg-card"
                )}
              >
                {service}
              </button>
            ))}
          </div>
          {form.formState.errors.serviceTypes && (
            <p className="text-sm text-destructive">{form.formState.errors.serviceTypes.message}</p>
          )}

          <SectionTitle title="Vehicul intervenție" />
          <RadioGrid
            label="Tip vehicul"
            values={[
              ["tow_truck", "Platformă"],
              ["service_van", "Van service"],
              ["motorcycle", "Moto"],
              ["utility", "Utilitară"]
            ]}
            active={form.watch("interventionVehicleType") || "tow_truck"}
            onChange={(value) =>
              form.setValue("interventionVehicleType", value as "tow_truck" | "service_van" | "motorcycle" | "utility")
            }
          />
          <section className="grid gap-3 sm:grid-cols-2">
            <Field label="Număr înmatriculare" error={form.formState.errors.interventionPlateNumber?.message}>
              <Input {...form.register("interventionPlateNumber")} />
            </Field>
            <Field label="Capacitate tractare kg" error={form.formState.errors.towingCapacity?.message}>
              <Input type="number" min={0} {...form.register("towingCapacity")} />
            </Field>
          </section>
          <Field label="Echipamente disponibile" error={form.formState.errors.equipment?.message}>
            <Input placeholder="Booster, cric, platformă, kit pană" {...form.register("equipment")} />
          </Field>
          <DocumentDropzone label="Documente operator și vehicul intervenție" />
        </>
      )}

      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
        <UserPlus className="h-4 w-4" />
        {submitText[instance]}
      </Button>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-t pt-4">
      <FileCheck2 className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
  );
}

function DocumentDropzone({ label }: { label: string }) {
  return (
    <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-card p-4 text-center text-sm text-muted-foreground">
      <Camera className="h-5 w-5" />
      {label}
      <span className="text-xs">Permis, talon, RCA, ITP, autorizații sau poze vehicul</span>
      <input type="file" multiple accept="image/*,.pdf" className="sr-only" />
    </label>
  );
}

function RadioGrid({
  label,
  values,
  active,
  onChange
}: {
  label: string;
  values: [string, string][];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {values.map(([value, text]) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={cn(
              "min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === value ? "border-primary bg-primary text-primary-foreground" : "bg-card"
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
