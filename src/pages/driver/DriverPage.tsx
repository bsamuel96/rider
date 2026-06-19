import { CheckCircle2, MapPinned, Power, Route } from "lucide-react";
import { MobilityMap } from "@/components/maps/MobilityMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";

export function DriverPage() {
  const { position } = useGeolocation();

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[380px_1fr]">
      <section className="space-y-5">
        <div>
          <Badge>Șofer</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Disponibil pentru curse</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceptă curse, vezi locații și schimbă statusul.</p>
        </div>

        <Card className="p-5">
          <div className="grid gap-3">
            <Button>
              <CheckCircle2 className="h-4 w-4" />
              Acceptă cursa propusă
            </Button>
            <Button variant="outline">
              <Route className="h-4 w-4" />
              În drum spre client
            </Button>
            <Button variant="secondary">
              <Power className="h-4 w-4" />
              Schimbă statusul
            </Button>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <MobilityMap pickup={position} />
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm">
            <MapPinned className="h-4 w-4 text-primary" />
            Locația șoferului se publică în driver_locations prin Supabase Realtime.
          </p>
        </Card>
      </section>
    </div>
  );
}
