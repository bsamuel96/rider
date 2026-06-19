import { useMemo, useState } from "react";
import { Banknote, CarFront, CheckCircle2, Power, Route, Star } from "lucide-react";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapStatusPill } from "@/components/maps/MapStatusPill";
import { CashCollectionPanel } from "@/components/payment/CashCollectionPanel";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { BookingStatus, CashStatus, Coordinates } from "@/types/domain";
import { estimateEtaMinutes, haversineDistanceKm } from "@/utils/geo";

const driverActions = ["Acceptă", "Merg spre client", "Am ajuns", "Încep cursa", "Finalizez"] as const;
const statusByStep: BookingStatus[] = ["searching", "driver_en_route", "arrived", "in_progress", "completed"];

export function DriverPage() {
  const { position } = useGeolocation();
  const [online, setOnline] = useState(true);
  const [step, setStep] = useState(0);
  const [cashStatus, setCashStatus] = useState<CashStatus>("pending_collection");
  const pickup = useMemo<Coordinates>(
    () => ({
      lat: position.lat + 0.012,
      lng: position.lng - 0.009
    }),
    [position.lat, position.lng]
  );
  const destination = useMemo<Coordinates>(
    () => ({
      lat: position.lat + 0.028,
      lng: position.lng + 0.018
    }),
    [position.lat, position.lng]
  );
  const distanceToPickupKm = haversineDistanceKm(position, pickup);
  const etaToPickupMinutes = estimateEtaMinutes(distanceToPickupKm, "driver_to_pickup");
  const distanceToDestinationKm = haversineDistanceKm(pickup, destination);
  const etaToDestinationMinutes = estimateEtaMinutes(distanceToDestinationKm, "active_ride");
  const currentStatus = online ? statusByStep[step] : "offline";
  const actionLabel = online ? driverActions[step] : "Devino disponibil";

  const advance = () => {
    if (!online) {
      setOnline(true);
      return;
    }

    setStep((current) => Math.min(driverActions.length - 1, current + 1));
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        portalLabel="Șofer"
        activeRole="driver"
        serviceType="standard"
        status={currentStatus}
        userLocation={position}
        pickupLocation={pickup}
        destinationLocation={destination}
        driverLocation={position}
        etaToPickupMinutes={etaToPickupMinutes}
        etaToDestinationMinutes={etaToDestinationMinutes}
        distanceToPickupKm={distanceToPickupKm}
        distanceToDestinationKm={distanceToDestinationKm}
        paymentMethod="cash"
        cashEnabled
        fareEstimate={42}
        rating={4.96}
        primaryActionLabel={actionLabel}
        secondaryActionLabel={online ? "Offline" : undefined}
        onPrimaryAction={advance}
        onSecondaryAction={() => setOnline(false)}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <MapFloatingPanel className="absolute left-3 top-[7rem] z-[520] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2 p-2 md:left-5 md:max-w-[420px]">
        <button
          type="button"
          onClick={() => setOnline((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-muted/70 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={online ? "Setează offline" : "Setează online"}
        >
          <Power className="h-4 w-4 text-primary" aria-hidden="true" />
          {online ? "Online" : "Offline"}
        </button>
        <MapStatusPill label="420 RON azi" />
        <MapStatusPill label="4.96 ★" />
      </MapFloatingPanel>

      {cashStatus !== "collected" && step >= 3 && (
        <div className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+16.5rem)] z-[520] md:left-auto md:right-5 md:w-[360px]">
          <CashCollectionPanel amount={42} status={cashStatus} onCollected={() => setCashStatus("collected")} />
        </div>
      )}

      <aside className="pointer-events-none absolute right-5 top-24 z-[520] hidden w-[360px] space-y-3 xl:block">
        <MapFloatingPanel className="pointer-events-auto space-y-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <CarFront className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-semibold">Cerere activă</h1>
              <p className="mt-1 text-sm text-muted-foreground">Victoriei către Otopeni, cash la final, ETA actualizat pe hartă.</p>
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Route className="h-4 w-4 text-primary" aria-hidden="true" />
                Pickup
              </span>
              <strong>~{etaToPickupMinutes} min</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Banknote className="h-4 w-4 text-primary" aria-hidden="true" />
                Cash de încasat
              </span>
              <strong>42 RON</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 text-primary" aria-hidden="true" />
                Rating
              </span>
              <strong>4.96 ★</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={advance}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </button>
        </MapFloatingPanel>
      </aside>
    </MapFirstPage>
  );
}
