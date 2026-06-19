import { CheckCircle2, Headphones, MapPin, TimerReset } from "lucide-react";
import { MobilityMap } from "@/components/maps/MobilityMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";

export function OperatorPage() {
  const { position } = useGeolocation();

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[380px_1fr]">
      <section className="space-y-5">
        <div>
          <Badge variant="warning">Operator Roadside</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Dispecerat intervenții</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceptă solicitări, vezi poziția clientului și actualizează starea.</p>
        </div>

        <Card className="p-5">
          <div className="space-y-4">
            <div className="rounded-lg border bg-background p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Headphones className="h-4 w-4 text-primary" />
                Solicitare nouă: baterie descărcată
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Client la 3.2 km, ETA echipaj 14 min.</p>
            </div>
            <Button className="w-full">
              <CheckCircle2 className="h-4 w-4" />
              Acceptă solicitarea
            </Button>
            <Button className="w-full" variant="outline">
              <TimerReset className="h-4 w-4" />
              Actualizează starea
            </Button>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <MobilityMap pickup={position} />
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            Coordonate client: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </p>
        </Card>
      </section>
    </div>
  );
}
