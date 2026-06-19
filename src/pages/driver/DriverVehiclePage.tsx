import { Car, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DriverVehiclePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Vehicul activ</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestionează vehiculul folosit pentru curse.</p>
      </div>
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary">
            <Car className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Dacia Jogger</h2>
            <p className="mt-1 text-sm text-muted-foreground">B101RID, standard, 4 locuri</p>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Status documente: active
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
