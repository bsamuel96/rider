import { Banknote, CheckCircle2 } from "lucide-react";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { Button } from "@/components/ui/button";
import type { DriverActiveBooking } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type DriverCashSheetProps = {
  booking: DriverActiveBooking;
  onCollected: () => void;
};

export function DriverCashSheet({ booking, onCollected }: DriverCashSheetProps) {
  return (
    <MapFloatingPanel className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary">
          <Banknote className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Încasează cash</h2>
          <p className="mt-1 text-sm text-muted-foreground">Confirmă încasarea înainte să evaluezi clientul.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-muted/60 p-4">
        <p className="text-sm text-muted-foreground">Sumă de încasat</p>
        <p className="mt-1 text-3xl font-semibold">{formatCurrency(booking.fareEstimate)}</p>
      </div>

      <Button type="button" className="w-full" onClick={onCollected}>
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Am încasat
      </Button>
    </MapFloatingPanel>
  );
}
