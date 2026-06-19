import { Truck, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";

export function RoadsideFleetPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Fleet mini-summary</h1>
        <p className="mt-1 text-sm text-muted-foreground">Echipaje, servicii și disponibilitate.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {["Platforme active: 3", "Van service: 2", "Servicii disponibile: 8"].map((item) => (
          <Card key={item} className="flex items-center gap-3 p-5">
            {item.includes("Servicii") ? <Wrench className="h-5 w-5 text-primary" /> : <Truck className="h-5 w-5 text-primary" />}
            <span className="font-semibold">{item}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
