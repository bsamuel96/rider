import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CarFront, Phone, ShieldCheck, Truck } from "lucide-react";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useLiveActorLocations } from "@/hooks/useLiveActorLocations";
import { usePaymentState } from "@/hooks/usePaymentState";
import { useAppStore } from "@/store/useAppStore";
import type { BookingStatus, Coordinates, ServiceType } from "@/types/domain";
import { STATUS_LABELS } from "@/utils/constants";
import { estimateEtaMinutes, formatDistanceKm, haversineDistanceKm } from "@/utils/geo";

const statuses: BookingStatus[] = ["searching", "confirmed", "driver_en_route", "arrived", "in_progress", "completed"];

const actionByStatus: Record<BookingStatus, string> = {
  searching: "Căutăm șofer",
  confirmed: "Confirmat",
  driver_en_route: "Șoferul vine spre tine",
  arrived: "A sosit",
  in_progress: "Cursa a început",
  completed: "Finalizează rating",
  cancelled: "Anulat"
};

export function TrackingPage() {
  const draft = useAppStore((state) => state.bookingDraft);
  const payment = usePaymentState();
  const [statusIndex, setStatusIndex] = useState(0);
  const serviceType: ServiceType = draft.serviceType || "standard";
  const isRoadsideService = serviceType === "tow" || serviceType === "roadside";
  const actors = useLiveActorLocations({
    pickupLocation: draft.pickup,
    destinationLocation: draft.destination,
    serviceType
  });
  const pickup = draft.pickup || actors.userLocation;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusIndex((current) => Math.min(statuses.length - 1, current + 1));
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  const movingDriver = useMemo<Coordinates>(() => {
    const offset = Math.max(0.002, 0.018 - statusIndex * 0.003);
    return {
      lat: pickup.lat + offset,
      lng: pickup.lng - offset
    };
  }, [pickup.lat, pickup.lng, statusIndex]);

  const movingRoadside = useMemo<Coordinates>(() => {
    const offset = Math.max(0.003, 0.024 - statusIndex * 0.004);
    return {
      lat: pickup.lat - offset,
      lng: pickup.lng + offset
    };
  }, [pickup.lat, pickup.lng, statusIndex]);

  const currentStatus = statuses[statusIndex];
  const activeActor = isRoadsideService ? movingRoadside : movingDriver;
  const distanceToPickupKm = haversineDistanceKm(activeActor, pickup);
  const etaToPickupMinutes = estimateEtaMinutes(distanceToPickupKm, isRoadsideService ? "roadside_to_pickup" : "driver_to_pickup");
  const fareEstimate = draft.fareEstimate || draft.price || (isRoadsideService ? 180 : 42);

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        portalLabel={isRoadsideService ? "Tracking intervenție" : "Tracking cursă"}
        activeRole="customer"
        serviceType={serviceType}
        status={currentStatus}
        userLocation={actors.userLocation}
        pickupLocation={pickup}
        destinationLocation={draft.destination}
        driverLocation={isRoadsideService ? actors.driverLocation : movingDriver}
        roadsideLocation={isRoadsideService ? movingRoadside : actors.roadsideLocation}
        etaToPickupMinutes={etaToPickupMinutes}
        etaToDestinationMinutes={actors.etaToDestinationMinutes}
        distanceToPickupKm={distanceToPickupKm}
        distanceToDestinationKm={actors.distanceToDestinationKm}
        paymentMethod={payment.paymentMethod}
        cashEnabled={payment.paymentMethod === "cash"}
        fareEstimate={fareEstimate}
        rating={isRoadsideService ? 4.92 : 4.96}
        primaryActionLabel={actionByStatus[currentStatus]}
        secondaryActionLabel={currentStatus === "completed" ? undefined : "Anulează"}
        completed={currentStatus === "completed"}
        onCashToggle={payment.togglePaymentMethod}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      {currentStatus !== "completed" && (
        <MapFloatingPanel className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+16.5rem)] z-[520] space-y-3 md:left-auto md:right-5 md:w-[360px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                {isRoadsideService ? <Truck className="h-5 w-5" aria-hidden="true" /> : <CarFront className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div>
                <p className="text-sm font-semibold">{isRoadsideService ? "Operator Roadside" : "Andrei · B 101 RID"}</p>
                <p className="text-xs text-muted-foreground">
                  {STATUS_LABELS[currentStatus]} · {formatDistanceKm(distanceToPickupKm)}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl border bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Sună operatorul"
              title="Sună operatorul"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="rounded-xl bg-muted/70 p-3">
              ETA
              <strong className="mt-1 block text-sm">~{etaToPickupMinutes} min</strong>
            </span>
            <span className="rounded-xl bg-muted/70 p-3">
              Plată
              <strong className="mt-1 block text-sm">{payment.paymentMethod === "cash" ? "Cash" : "Card"}</strong>
            </span>
          </div>
        </MapFloatingPanel>
      )}

      <MapFloatingPanel className="absolute left-3 top-[7rem] z-[520] hidden max-w-[320px] items-center gap-3 md:flex">
        {currentStatus === "searching" ? (
          <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        )}
        <p className="text-sm text-muted-foreground">ETA și pozițiile sunt aproximative în demo și realtime când Supabase trimite locații.</p>
      </MapFloatingPanel>
    </MapFirstPage>
  );
}
