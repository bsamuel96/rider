import { Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";

const metrics = [
  ["Azi", "420 RON"],
  ["Săptămâna asta", "2.840 RON"],
  ["Luna asta", "9.760 RON"]
];

export function DriverEarningsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Câștiguri</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rezumat rapid pentru activitatea ta.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
              <Banknote className="h-5 w-5 text-primary" />
              {value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
