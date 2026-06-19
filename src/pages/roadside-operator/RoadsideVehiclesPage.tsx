import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";

export function RoadsideVehiclesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Vehicule intervenție</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestionează platforme, van-uri service și utilitare.</p>
      </div>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary">
            <Truck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Platformă tractare</h2>
            <p className="text-sm text-muted-foreground">B103RID, capacitate 2500 kg, status activ.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
