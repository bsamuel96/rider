import { Link } from "react-router-dom";
import { CheckCircle2, Clock, MapPin, Route } from "lucide-react";
import { createDemoDriverOffer } from "@/hooks/useDriverRideOffers";
import { Card } from "@/components/ui/card";
import { DEFAULT_CENTER } from "@/utils/constants";
import { formatCurrency, formatDistance } from "@/utils/format";

const demoRides = [createDemoDriverOffer(DEFAULT_CENTER, 0), createDemoDriverOffer(DEFAULT_CENTER, 1)];

export function DriverRidesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Curse</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ofertele noi apar pe harta principală. Aici vezi curse active și recente.</p>
      </div>

      <section className="space-y-3" aria-labelledby="active-rides-title">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 id="active-rides-title" className="font-semibold">
            În desfășurare
          </h2>
        </div>
        <RideCard ride={demoRides[0]} stateLabel="Spre client" />
      </section>

      <section className="space-y-3" aria-labelledby="completed-rides-title">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 id="completed-rides-title" className="font-semibold">
            Recente
          </h2>
        </div>
        <div className="grid gap-3">
          {demoRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} stateLabel="Finalizată" />
          ))}
        </div>
      </section>
    </div>
  );
}

type RideCardProps = {
  ride: (typeof demoRides)[number];
  stateLabel: string;
};

function RideCard({ ride, stateLabel }: RideCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">{stateLabel}</span>
          <p className="font-semibold">{ride.customerName}</p>
          <div className="grid gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              {ride.pickupAddress} → {ride.destinationAddress}
            </span>
            <span className="flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" aria-hidden="true" />
              {formatDistance(ride.routeDistanceKm)} · {ride.etaToDestinationMinutes} min
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <strong>{formatCurrency(ride.fareEstimate)}</strong>
          <Link
            to={`/driver/ride/${ride.bookingId}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Detalii
          </Link>
        </div>
      </div>
    </Card>
  );
}
