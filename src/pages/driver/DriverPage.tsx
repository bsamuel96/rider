import { Banknote, CheckCircle2, FileCheck2, MapPinned, Power, Route, Star } from "lucide-react";
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
          <Badge>Șofer activ</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Dashboard șofer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Devino disponibil, acceptă curse și actualizează statusul în timp real.</p>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Status online/offline</h2>
              <p className="mt-1 text-sm text-muted-foreground">Publică locația în realtime când ești online.</p>
            </div>
            <Button variant="secondary">
              <Power className="h-4 w-4" />
              Devino disponibil
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Cursă activă</h2>
          <p className="mt-1 text-sm text-muted-foreground">Victoriei către Otopeni, 18 min ETA.</p>
          <div className="mt-4 grid gap-2">
            <Button>
              <Route className="h-4 w-4" />
              Merg spre client
            </Button>
            <Button variant="secondary">
              Am ajuns
            </Button>
            <Button variant="outline">
              Încep cursa
            </Button>
            <Button variant="outline">
              Finalizez cursa
            </Button>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <MobilityMap pickup={position} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Azi</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
              <Banknote className="h-4 w-4 text-primary" />
              420 RON
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
              <Star className="h-4 w-4 text-primary" />
              4.96
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Documente</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
              <FileCheck2 className="h-4 w-4 text-primary" />
              Active
            </p>
          </Card>
        </div>
        <Card className="p-5">
          <h2 className="font-semibold">Curse disponibile</h2>
          <div className="mt-4 space-y-3">
            {["Unirii -> Pipera", "Aeroport -> Universitate"].map((ride) => (
              <div key={ride} className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
                <span className="text-sm font-medium">{ride}</span>
                <Button size="sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Acceptă
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinned className="h-4 w-4 text-primary" />
            Locația șoferului se publică în driver_locations prin Supabase Realtime.
          </p>
        </Card>
      </section>
    </div>
  );
}
