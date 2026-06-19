import { CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function RoadsideRequestsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Solicitări active</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acceptă intervenții și trimite ETA clientului.</p>
      </div>
      <div className="grid gap-3">
        {["Pană - DN1", "Baterie - Pipera", "Tractare - Berceni"].map((request) => (
          <Card key={request} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              {request}
            </span>
            <Button size="sm">
              <CheckCircle2 className="h-4 w-4" />
              Acceptă solicitarea
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
