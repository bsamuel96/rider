import { Power } from "lucide-react";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { Button } from "@/components/ui/button";

type DriverOfflineSheetProps = {
  onGoOnline: () => void;
};

export function DriverOfflineSheet({ onGoOnline }: DriverOfflineSheetProps) {
  return (
    <MapFloatingPanel className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tură oprită</p>
        <h2 className="mt-1 text-lg font-semibold">Ești offline</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pornește tura când ești gata să primești curse.</p>
      </div>
      <Button type="button" className="w-full" onClick={onGoOnline}>
        <Power className="h-4 w-4" aria-hidden="true" />
        Începe tura
      </Button>
    </MapFloatingPanel>
  );
}
