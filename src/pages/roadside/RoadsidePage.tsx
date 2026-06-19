import { useNavigate } from "react-router-dom";
import { MapPin, ShieldAlert } from "lucide-react";
import { RoadsideForm, type RoadsideFormValues } from "@/components/roadside/RoadsideForm";
import { MobilityMap } from "@/components/maps/MobilityMap";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppStore } from "@/store/useAppStore";

export function RoadsidePage() {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const pushNotification = useAppStore((state) => state.pushNotification);

  const submit = (values: RoadsideFormValues) => {
    pushNotification({
      id: crypto.randomUUID(),
      title: "Intervenție pornită",
      body: `Operatorul a primit solicitarea: ${values.issueType}.`,
      read: false,
      createdAt: new Date().toISOString()
    });
    navigate("/customer/tracking/roadside-demo");
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[420px_1fr]">
      <section className="space-y-5">
        <div>
          <Badge variant="warning">Maximum 2 acțiuni</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Asistență rutieră</h1>
          <p className="mt-1 text-sm text-muted-foreground">Alege problema, adaugă detalii și trimite poziția curentă.</p>
        </div>

        <Card className="p-5">
          <RoadsideForm onSubmit={submit} />
        </Card>
      </section>

      <aside className="space-y-5">
        <MobilityMap pickup={position} />
        <Card className="p-5">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">Poziție client</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Lat {position.lat.toFixed(5)}, Lng {position.lng.toFixed(5)}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Actualizare realtime activă
              </p>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
