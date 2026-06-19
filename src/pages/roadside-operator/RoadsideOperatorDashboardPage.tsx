import { useMemo, useState } from "react";
import { Banknote, CheckCircle2, Headphones, Phone, RadioTower, Star, Truck, Wrench } from "lucide-react";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapFloatingButton } from "@/components/maps/MapFloatingButton";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapStatusPill } from "@/components/maps/MapStatusPill";
import { CashCollectionPanel } from "@/components/payment/CashCollectionPanel";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { CashStatus, Coordinates } from "@/types/domain";
import { estimateEtaMinutes, haversineDistanceKm } from "@/utils/geo";

const operatorActions = ["Acceptă intervenția", "Merg spre client", "Am ajuns", "Încep intervenția", "Finalizează"] as const;
const operatorStatuses = ["new_request", "accepted", "driver_en_route", "arrived", "in_progress", "completed"] as const;

export function RoadsideOperatorDashboardPage() {
  const { position } = useGeolocation();
  const [online, setOnline] = useState(true);
  const [step, setStep] = useState(0);
  const [cashStatus, setCashStatus] = useState<CashStatus>("pending_collection");
  const clientLocation = useMemo<Coordinates>(
    () => ({
      lat: position.lat + 0.027,
      lng: position.lng - 0.018
    }),
    [position.lat, position.lng]
  );
  const incidentLocation = useMemo<Coordinates>(
    () => ({
      lat: clientLocation.lat + 0.003,
      lng: clientLocation.lng + 0.002
    }),
    [clientLocation.lat, clientLocation.lng]
  );
  const distanceToClientKm = haversineDistanceKm(position, clientLocation);
  const etaToClientMinutes = estimateEtaMinutes(distanceToClientKm, "tow_to_pickup");
  const currentStatus = online ? operatorStatuses[step] : "offline";
  const actionLabel = online ? operatorActions[step] : "Devino disponibil";

  const advance = () => {
    if (!online) {
      setOnline(true);
      return;
    }

    setStep((current) => Math.min(operatorActions.length - 1, current + 1));
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        portalLabel="Roadside"
        activeRole="roadside"
        serviceType="tow"
        status={currentStatus}
        userLocation={position}
        pickupLocation={clientLocation}
        destinationLocation={incidentLocation}
        roadsideLocation={position}
        driverLocation={undefined}
        etaToPickupMinutes={etaToClientMinutes}
        etaToDestinationMinutes={undefined}
        distanceToPickupKm={distanceToClientKm}
        distanceToDestinationKm={undefined}
        paymentMethod="cash"
        cashEnabled
        fareEstimate={180}
        rating={4.92}
        primaryActionLabel={actionLabel}
        secondaryActionLabel={online ? "Sună clientul" : undefined}
        completed={currentStatus === "completed"}
        onPrimaryAction={advance}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <MapFloatingPanel className="absolute left-3 top-[7rem] z-[520] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2 p-2 md:left-5 md:max-w-[430px]">
        <button
          type="button"
          onClick={() => setOnline((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-muted/70 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={online ? "Setează offline" : "Setează online"}
        >
          <RadioTower className="h-4 w-4 text-primary" aria-hidden="true" />
          {online ? "Online" : "Offline"}
        </button>
        <MapStatusPill label="Pană" tone="warning" />
        <MapStatusPill label="4 active" />
        <MapStatusPill label="4.92 ★" />
      </MapFloatingPanel>

      {cashStatus !== "collected" && step >= 3 && (
        <div className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+16.5rem)] z-[520] md:left-auto md:right-5 md:w-[360px]">
          <CashCollectionPanel amount={180} status={cashStatus} onCollected={() => setCashStatus("collected")} />
        </div>
      )}

      {(cashStatus === "collected" || step < 3) && (
        <MapFloatingPanel className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+16.5rem)] z-[510] space-y-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">Pană · DN1</p>
                <p className="text-xs text-muted-foreground">Client la ~{etaToClientMinutes} min · cash 180 RON</p>
              </div>
            </div>
            <MapFloatingButton aria-label="Sună clientul" title="Sună clientul">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </MapFloatingButton>
          </div>
        </MapFloatingPanel>
      )}

      <aside className="pointer-events-none absolute right-5 top-24 z-[520] hidden w-[360px] space-y-3 xl:block">
        <MapFloatingPanel className="pointer-events-auto space-y-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Truck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-semibold">Solicitare nouă</h1>
              <p className="mt-1 text-sm text-muted-foreground">Pană la client, platformă disponibilă, cash de încasat la final.</p>
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Headphones className="h-4 w-4 text-primary" aria-hidden="true" />
                Solicitări active
              </span>
              <strong>4</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Banknote className="h-4 w-4 text-primary" aria-hidden="true" />
                De încasat
              </span>
              <strong>180 RON</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 text-primary" aria-hidden="true" />
                Rating
              </span>
              <strong>4.92 ★</strong>
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
