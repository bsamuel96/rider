import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DriverRidesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Curse disponibile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acceptă sau refuză cursele propuse.</p>
      </div>
      <div className="grid gap-3">
        {["Piața Unirii -> Pipera", "Aeroport Otopeni -> Universitate", "Victoriei -> Băneasa"].map((ride) => (
          <Card key={ride} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold">{ride}</span>
            <div className="flex gap-2">
              <Button size="sm">
                <CheckCircle2 className="h-4 w-4" />
                Acceptă cursa
              </Button>
              <Button size="sm" variant="outline">
                <XCircle className="h-4 w-4" />
                Refuză
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
