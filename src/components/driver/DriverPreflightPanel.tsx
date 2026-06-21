import { CheckCircle2, ShieldCheck } from "lucide-react";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { Button } from "@/components/ui/button";

type DriverPreflightPanelProps = {
  onReady: () => void;
  onGoOffline: () => void;
};

const checks = ["Documente valabile", "Vehicul pregătit", "Telefon încărcat", "Locație GPS activă"];

export function DriverPreflightPanel({ onReady, onGoOffline }: DriverPreflightPanelProps) {
  return (
    <MapFloatingPanel className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Verificare rapidă</h2>
          <p className="mt-1 text-sm text-muted-foreground">Confirmă lucrurile esențiale înainte de disponibilitate.</p>
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        {checks.map((check) => (
          <div key={check} className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
            {check}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_1.4fr] gap-2">
        <Button type="button" variant="outline" onClick={onGoOffline}>
          Offline
        </Button>
        <Button type="button" onClick={onReady}>
          Sunt pregătit
        </Button>
      </div>
    </MapFloatingPanel>
  );
}
