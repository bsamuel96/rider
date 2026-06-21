import { AlertTriangle } from "lucide-react";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { Button } from "@/components/ui/button";

type DriverCancelRideDialogProps = {
  open: boolean;
  onClose: () => void;
  onCancelRide: (reason: string) => void;
};

const reasons = ["Clientul nu s-a prezentat", "Problemă de siguranță", "Vehicul indisponibil"];

export function DriverCancelRideDialog({ open, onClose, onCancelRide }: DriverCancelRideDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-[700] grid place-items-center bg-background/40 p-4 backdrop-blur-sm">
      <MapFloatingPanel className="w-full max-w-sm space-y-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/12 text-destructive">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold">Anulează cursa</h2>
            <p className="mt-1 text-sm text-muted-foreground">Alege motivul potrivit. Clientul va fi notificat.</p>
          </div>
        </div>

        <div className="grid gap-2">
          {reasons.map((reason) => (
            <Button key={reason} type="button" variant="outline" onClick={() => onCancelRide(reason)}>
              {reason}
            </Button>
          ))}
        </div>

        <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
          Renunță
        </Button>
      </MapFloatingPanel>
    </div>
  );
}
