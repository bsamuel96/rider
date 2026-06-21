import { Loader2, Power } from "lucide-react";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { Button } from "@/components/ui/button";
import type { DriverShiftSummary } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type DriverAvailableSheetProps = {
  shift: DriverShiftSummary;
  onGoOffline: () => void;
};

export function DriverAvailableSheet({ shift, onGoOffline }: DriverAvailableSheetProps) {
  return (
    <MapFloatingPanel className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Cauți curse</h2>
          <p className="mt-1 text-sm text-muted-foreground">Rămâi în zona activă. O cerere demo apare automat.</p>
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="text-xs text-muted-foreground">Azi</p>
          <p className="mt-1 font-semibold">{formatCurrency(shift.grossEarnings)}</p>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="text-xs text-muted-foreground">Curse</p>
          <p className="mt-1 font-semibold">{shift.completedRides}</p>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={onGoOffline}>
        <Power className="h-4 w-4" aria-hidden="true" />
        Ieși offline
      </Button>
    </MapFloatingPanel>
  );
}
