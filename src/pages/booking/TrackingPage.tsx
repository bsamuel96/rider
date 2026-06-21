import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Banknote, CarFront, CreditCard, LifeBuoy, MessageCircle, Phone, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapBottomSheet } from "@/components/maps/MapBottomSheet";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapRatingPanel } from "@/components/maps/MapRatingPanel";
import { RoadsideGuaranteeBanner } from "@/components/roadside/RoadsideGuaranteeBanner";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useLiveActorLocations } from "@/hooks/useLiveActorLocations";
import { usePaymentState } from "@/hooks/usePaymentState";
import { useRoadsideGuarantee } from "@/hooks/useRoadsideGuarantee";
import { useStreetRoute } from "@/hooks/useStreetRoute";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import type { BookingStatus, Coordinates, ServiceType } from "@/types/domain";
import { STATUS_LABELS } from "@/utils/constants";
import { getChatBasePath, getSupportBasePath } from "@/utils/communicationRoutes";
import { formatCurrency } from "@/utils/format";
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
  const profile = useAppStore((state) => state.profile);
  const navigate = useNavigate();
  const payment = usePaymentState();
  const { toast } = useToast();
  const [statusIndex, setStatusIndex] = useState(0);
  const serviceType: ServiceType = draft.serviceType || "standard";
  const isRoadsideService = serviceType === "tow" || serviceType === "roadside";
  const chatThreadId = isRoadsideService ? "roadside-demo-roadside-active" : "ride-demo-booking-active";
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
  const trackingRoute = useStreetRoute({
    from: activeActor,
    to: pickup,
    enabled: currentStatus === "driver_en_route" || currentStatus === "confirmed" || currentStatus === "searching"
  });
  const displayDistanceToPickupKm = trackingRoute.distanceKm ?? distanceToPickupKm;
  const displayEtaToPickupMinutes = trackingRoute.durationMinutes ?? etaToPickupMinutes;
  const fareEstimate = draft.fareEstimate || draft.price || (isRoadsideService ? 180 : 42);
  const PaymentIcon = payment.isCash ? Banknote : CreditCard;
  const guarantee = useRoadsideGuarantee({
    speedTier: draft.roadsideSpeedTier || "normal",
    deadline: draft.roadsideFastGuaranteeDeadline,
    fastGuaranteeApplied: draft.roadsideFastGuaranteeApplied
  });

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
        etaToPickupMinutes={displayEtaToPickupMinutes}
        etaToDestinationMinutes={actors.etaToDestinationMinutes}
        distanceToPickupKm={displayDistanceToPickupKm}
        distanceToDestinationKm={actors.distanceToDestinationKm}
        paymentMethod={payment.paymentMethod}
        cashEnabled={payment.paymentMethod === "cash"}
        fareEstimate={fareEstimate}
        rating={isRoadsideService ? 4.92 : 4.96}
        primaryActionLabel={actionByStatus[currentStatus]}
        secondaryActionLabel={currentStatus === "completed" ? undefined : "Anulează"}
        completed={currentStatus === "completed"}
        showBottomControls={false}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <MapBottomSheet className="absolute inset-x-3 bottom-[var(--floating-bottom-offset)] z-[540] max-h-[min(50svh,430px)] overflow-y-auto md:inset-x-auto md:bottom-5 md:right-5 md:w-[380px]">
        {currentStatus === "completed" ? (
          <MapRatingPanel roadside={isRoadsideService} />
        ) : (
          <div className="space-y-3">
          {isRoadsideService && (
            <RoadsideGuaranteeBanner status={guarantee.status} remainingMinutes={guarantee.remainingMinutes} />
          )}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                {isRoadsideService ? <Truck className="h-5 w-5" aria-hidden="true" /> : <CarFront className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div>
                <p className="text-sm font-semibold">{isRoadsideService ? "Operator Roadside" : "Andrei · B 101 RID"}</p>
                <p className="text-xs text-muted-foreground">
                  {STATUS_LABELS[currentStatus]} · {formatDistanceKm(displayDistanceToPickupKm)}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/70 px-2 text-xs font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => navigate(`${getChatBasePath(profile)}/${chatThreadId}`)}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Mesaj
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/70 px-2 text-xs font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Sună operatorul"
              title="Sună operatorul"
              onClick={() =>
                toast({
                  title: isRoadsideService ? "Operator notificat în demo" : "Șofer notificat în demo",
                  description: "În producție, aici se va iniția apelul.",
                  tone: "success"
                })
              }
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Sună
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/70 px-2 text-xs font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => navigate(`${getSupportBasePath(profile)}/new`)}
            >
              <LifeBuoy className="h-4 w-4" aria-hidden="true" />
              Suport
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="rounded-xl bg-muted/65 p-3">
              ETA
              <strong className="mt-1 block text-sm">~{displayEtaToPickupMinutes} min</strong>
            </span>
            <span className="rounded-xl bg-muted/65 p-3">
              Distanță
              <strong className="mt-1 block text-sm">{formatDistanceKm(displayDistanceToPickupKm)}</strong>
            </span>
            <span className="rounded-xl bg-muted/65 p-3">
              Plată
              <strong className="mt-1 flex items-center gap-1.5 text-sm">
                <PaymentIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {payment.isCash ? "Cash · final" : "Card · pregătit"}
              </strong>
            </span>
            <span className="rounded-xl bg-muted/65 p-3">
              Cost
              <strong className="mt-1 block text-sm">{formatCurrency(fareEstimate)}</strong>
            </span>
          </div>
          <button
            type="button"
            className="min-h-12 w-full rounded-xl border border-border/60 bg-background/55 px-4 text-sm font-semibold transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() =>
              toast({
                title: "Anulare demo",
                description: "Cursa a primit o cerere de anulare în demo.",
                tone: "warning"
              })
            }
          >
            Anulează
          </button>
          </div>
        )}
      </MapBottomSheet>

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
