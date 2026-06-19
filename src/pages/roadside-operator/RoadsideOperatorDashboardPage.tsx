import { CheckCircle2, Clock3, Headphones, MapPin, TimerReset, Truck, Wrench } from "lucide-react";
import { MobilityMap } from "@/components/maps/MobilityMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";

export function RoadsideOperatorDashboardPage() {
  const { position } = useGeolocation();

  return (
    <div className="mx-auto grid max-w-6xl gap-5 xl:grid-cols-[390px_1fr]">
      <section className="space-y-5">
        <div>
          <Badge variant="warning">Tractare & Asistență</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Dispecerat intervenții</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceptă solicitări, trimite ETA și actualizează starea intervenției.</p>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Status online/offline</h2>
              <p className="mt-1 text-sm text-muted-foreground">Primești intervenții doar când ești disponibil.</p>
            </div>
            <Button variant="secondary">
              <Wrench className="h-4 w-4" />
              Devino disponibil
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Solicitare nouă</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pană pe DN1, client la 4.1 km, ETA estimat 16 min.</p>
          <div className="mt-4 grid gap-2">
            <Button>
              <CheckCircle2 className="h-4 w-4" />
              Acceptă intervenția
            </Button>
            <Button variant="outline">
              <TimerReset className="h-4 w-4" />
              Merg spre client
            </Button>
            <Button variant="outline">Am ajuns la client</Button>
            <Button variant="outline">Finalizează intervenția</Button>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <MobilityMap pickup={position} />
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Solicitări active</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
              <Headphones className="h-4 w-4 text-primary" />4
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Vehicul intervenție</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
              <Truck className="h-4 w-4 text-primary" />
              Activ
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Timp mediu</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
              <Clock3 className="h-4 w-4 text-primary" />
              14 min
            </p>
          </Card>
        </div>
        <Card className="p-5">
          <h2 className="font-semibold">Echipamente disponibile</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["Booster", "Kit pană", "Platformă", "Compresor", "Cric", "Cabluri"].map((item) => (
              <span key={item} className="rounded-lg border bg-background p-3 text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Poziția clientului este actualizată prin Supabase Realtime.
          </p>
        </Card>
      </section>
    </div>
  );
}
