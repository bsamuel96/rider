import { CheckCircle2, MapPin, Star, Timer, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DriverRideOffer } from "@/types/domain";
import { formatCurrency, formatDistance } from "@/utils/format";

type DriverOfferCardProps = {
  offer: DriverRideOffer;
  countdownSeconds: number;
  onAccept: () => void;
  onReject: () => void;
};

export function DriverOfferCard({ offer, countdownSeconds, onAccept, onReject }: DriverOfferCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Cerere nouă</p>
          <h2 className="mt-1 text-lg font-semibold">{formatCurrency(offer.fareEstimate)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDistance(offer.routeDistanceKm)} · {offer.etaToDestinationMinutes} min
          </p>
        </div>
        <span className="inline-flex min-h-9 items-center gap-1 rounded-full bg-amber-500/12 px-3 text-xs font-semibold text-amber-700 dark:text-amber-300">
          <Timer className="h-4 w-4" aria-hidden="true" />
          {countdownSeconds}s
        </span>
      </div>

      <div className="grid gap-2 text-sm">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-semibold">{offer.pickupAddress}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {offer.destinationAddress}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-sm">
        <span>{offer.customerName}</span>
        <span className="inline-flex items-center gap-1 font-semibold">
          <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
          {offer.customerRating.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" onClick={onReject}>
          <XCircle className="h-4 w-4" aria-hidden="true" />
          Refuză
        </Button>
        <Button type="button" onClick={onAccept}>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Acceptă
        </Button>
      </div>
    </div>
  );
}
