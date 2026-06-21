import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { MobileBookingTopBar } from "@/components/booking/MobileBookingTopBar";
import type { BookingMobileStep } from "@/components/booking/MobileBookingTypes";
import { MobileLocationSheet } from "@/components/booking/MobileLocationSheet";
import { MobilePaymentSheet } from "@/components/booking/MobilePaymentSheet";
import { MobileReviewSheet } from "@/components/booking/MobileReviewSheet";
import { MobileServiceSheet } from "@/components/booking/MobileServiceSheet";
import { MapBottomSheet } from "@/components/maps/MapBottomSheet";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapServiceDock } from "@/components/maps/MapServiceDock";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useLiveActorLocations } from "@/hooks/useLiveActorLocations";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePaymentState } from "@/hooks/usePaymentState";
import { useStreetRoute } from "@/hooks/useStreetRoute";
import { calculateBookingEstimate } from "@/services/pricing";
import { createCurrentLocationSuggestion } from "@/services/geocoding";
import { useAppStore } from "@/store/useAppStore";
import type { BookingDraft, ServiceType } from "@/types/domain";
import { formatCurrency, formatDistance } from "@/utils/format";

const fallbackFare: Record<ServiceType, number> = {
  standard: 42,
  premium: 68,
  tow: 180,
  roadside: 95
};

export function BookingPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mobileStep, setMobileStep] = useState<BookingMobileStep>("location");
  const bookingDraft = useAppStore((state) => state.bookingDraft);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const addRecentLocation = useAppStore((state) => state.addRecentLocation);
  const pushNotification = useAppStore((state) => state.pushNotification);
  const payment = usePaymentState();
  const serviceType = bookingDraft.serviceType || "standard";
  const actors = useLiveActorLocations({
    pickupLocation: bookingDraft.pickup,
    destinationLocation: bookingDraft.destination,
    serviceType
  });
  const bookingRoute = useStreetRoute({
    from: bookingDraft.pickup,
    to: bookingDraft.destination,
    enabled: Boolean(bookingDraft.pickup && bookingDraft.destination)
  });
  const fareEstimate = bookingDraft.fareEstimate || bookingDraft.price || fallbackFare[serviceType];
  const displayDistanceKm = bookingRoute.distanceKm ?? bookingDraft.distanceKm;
  const displayDurationMinutes = bookingRoute.durationMinutes ?? bookingDraft.durationMinutes ?? actors.etaToDestinationMinutes ?? 8;

  useEffect(() => {
    if (!bookingDraft.destination && mobileStep !== "location") {
      setMobileStep("location");
    }
  }, [bookingDraft.destination, mobileStep]);

  useEffect(() => {
    if (!bookingDraft.pickup) {
      updateBookingDraft({
        pickup: createCurrentLocationSuggestion(actors.userLocation.lat, actors.userLocation.lng),
        serviceType,
        paymentMethod: payment.paymentMethod,
        cashRequired: payment.isCash,
        cashStatus: payment.isCash ? "pending_collection" : "not_required",
        currency: "RON"
      });
    }
  }, [
    actors.userLocation.lat,
    actors.userLocation.lng,
    bookingDraft.pickup,
    payment.isCash,
    payment.paymentMethod,
    serviceType,
    updateBookingDraft
  ]);

  useEffect(() => {
    if (bookingRoute.provider === "none" || !bookingRoute.distanceKm || !bookingRoute.durationMinutes) {
      return;
    }

    updateBookingDraft({
      distanceKm: bookingRoute.distanceKm,
      durationMinutes: bookingRoute.durationMinutes
    });
  }, [bookingRoute.distanceKm, bookingRoute.durationMinutes, bookingRoute.provider, updateBookingDraft]);

  const updateEstimate = (patch: Partial<BookingDraft> = {}) => {
    const nextDraft = calculateBookingEstimate({
      ...bookingDraft,
      serviceType,
      paymentMethod: payment.paymentMethod,
      currency: "RON",
      ...patch
    });

    updateBookingDraft({
      ...nextDraft,
      fareEstimate: nextDraft.price || fallbackFare[nextDraft.serviceType || serviceType],
      currency: "RON"
    });
  };

  const canConfirm = Boolean(bookingDraft.pickup && bookingDraft.destination && serviceType);

  const updateService = (nextService: ServiceType) => {
    updateEstimate({ serviceType: nextService });

    if (nextService === "tow" || nextService === "roadside") {
      navigate(`/customer/roadside?mode=${nextService}`);
    }
  };

  const confirm = () => {
    if (!canConfirm) {
      return;
    }

    updateBookingDraft({
      serviceType,
      paymentMethod: payment.paymentMethod,
      cashRequired: payment.isCash,
      cashStatus: payment.isCash ? "pending_collection" : "not_required",
      fareEstimate,
      currency: "RON"
    });

    if (bookingDraft.destination) {
      addRecentLocation({
        id: bookingDraft.destination.id,
        label: bookingDraft.destination.street || bookingDraft.destination.label,
        address:
          [bookingDraft.destination.number, bookingDraft.destination.city, bookingDraft.destination.county]
            .filter(Boolean)
            .join(", ") || bookingDraft.destination.label,
        lat: bookingDraft.destination.lat,
        lng: bookingDraft.destination.lng,
        lastUsedAt: new Date().toISOString()
      });
    }

    pushNotification({
      id: crypto.randomUUID(),
      title: "Comandă trimisă",
      body:
        payment.paymentMethod === "cash"
          ? "Căutăm șofer. Plata cash va fi confirmată la final."
          : "Căutăm șofer. Plata cu cardul va fi procesată la final.",
      read: false,
      createdAt: new Date().toISOString()
    });
    navigate("/customer/tracking/demo");
  };

  const goBackFromStep = () => {
    if (mobileStep === "location") {
      navigate("/customer");
      return;
    }

    if (mobileStep === "service") {
      setMobileStep("location");
      return;
    }

    if (mobileStep === "payment") {
      setMobileStep("service");
      return;
    }

    setMobileStep("payment");
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        portalLabel="Cursă"
        activeRole="customer"
        serviceType={serviceType}
        status={canConfirm ? "confirmed" : "online"}
        userLocation={actors.userLocation}
        pickupLocation={bookingDraft.pickup || actors.userLocation}
        destinationLocation={bookingDraft.destination}
        driverLocation={actors.driverLocation}
        roadsideLocation={actors.roadsideLocation}
        etaToPickupMinutes={actors.etaToPickupMinutes}
        etaToDestinationMinutes={actors.etaToDestinationMinutes}
        distanceToPickupKm={actors.distanceToPickupKm}
        distanceToDestinationKm={actors.distanceToDestinationKm}
        paymentMethod={payment.paymentMethod}
        cashEnabled={payment.paymentMethod === "cash"}
        fareEstimate={fareEstimate}
        rating={4.9}
        primaryActionLabel={canConfirm ? "Confirmă" : "Completează traseul"}
        showTopOverlay={!isMobile}
        showBottomOverlay={false}
        showBottomControls={false}
        showServiceDock={false}
        showPaymentChip={false}
        showMainActions={false}
        minimal={isMobile}
        onPrimaryAction={confirm}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      {isMobile ? (
        <>
          <MobileBookingTopBar
            step={mobileStep}
            etaMinutes={bookingDraft.destination ? displayDurationMinutes : undefined}
            onBack={goBackFromStep}
          />
          {mobileStep === "location" && (
            <MobileLocationSheet
              pickup={bookingDraft.pickup}
              destination={bookingDraft.destination}
              currentLat={actors.userLocation.lat}
              currentLng={actors.userLocation.lng}
              onDestinationSelect={(destination) => updateEstimate({ destination })}
              onContinue={() => setMobileStep("service")}
            />
          )}
          {mobileStep === "service" && (
            <MobileServiceSheet
              serviceType={serviceType}
              distanceKm={displayDistanceKm}
              etaMinutes={displayDurationMinutes}
              onServiceChange={updateService}
              onBack={() => setMobileStep("location")}
              onContinue={() => setMobileStep("payment")}
            />
          )}
          {mobileStep === "payment" && (
            <MobilePaymentSheet
              paymentMethod={payment.paymentMethod}
              fareEstimate={fareEstimate}
              etaMinutes={displayDurationMinutes}
              onPaymentChange={payment.setPaymentMethod}
              onBack={() => setMobileStep("service")}
              onContinue={() => setMobileStep("review")}
            />
          )}
          {mobileStep === "review" && (
            <MobileReviewSheet
              pickup={bookingDraft.pickup}
              destination={bookingDraft.destination}
              serviceType={serviceType}
              paymentMethod={payment.paymentMethod}
              fareEstimate={fareEstimate}
              etaMinutes={displayDurationMinutes}
              distanceKm={displayDistanceKm}
              canConfirm={canConfirm}
              onBack={() => setMobileStep("payment")}
              onConfirm={confirm}
            />
          )}
        </>
      ) : (
        <>
          <MapFloatingPanel className="absolute inset-x-3 top-[calc(env(safe-area-inset-top)+6.25rem)] z-[520] space-y-3 p-3 md:left-5 md:right-auto md:w-[390px]">
            <AddressSearch
              label="Pickup"
              placeholder="De unde pleci?"
              currentLat={actors.userLocation.lat}
              currentLng={actors.userLocation.lng}
              value={bookingDraft.pickup}
              onSelect={(pickup) => updateEstimate({ pickup })}
            />
            <AddressSearch
              label="Destinație"
              placeholder="Unde dorești să mergi?"
              value={bookingDraft.destination}
              onSelect={(destination) => updateEstimate({ destination })}
            />
          </MapFloatingPanel>

          <MapBottomSheet className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-[540] max-h-[min(48svh,420px)] overflow-y-auto md:inset-x-auto md:bottom-5 md:right-5 md:w-[360px]">
            <div className="space-y-3">
              <MapServiceDock value={serviceType} onChange={updateService} />
              <PaymentMethodSelector
                value={payment.paymentMethod}
                onChange={payment.setPaymentMethod}
                fareEstimate={fareEstimate}
              />
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="rounded-xl bg-muted/65 p-3">
                  Cost
                  <strong className="mt-1 block text-sm">{formatCurrency(fareEstimate)}</strong>
                </span>
                <span className="rounded-xl bg-muted/65 p-3">
                  ETA
                  <strong className="mt-1 block text-sm">~{displayDurationMinutes} min</strong>
                </span>
                <span className="rounded-xl bg-muted/65 p-3">
                  Rută
                  <strong className="mt-1 block truncate text-sm">{formatDistance(displayDistanceKm)}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={confirm}
                disabled={!canConfirm}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Confirmă cursa
              </button>
              <p className="inline-flex items-center gap-2 px-1 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                ETA și prețul se actualizează când alegi traseul.
              </p>
              <button
                type="button"
                onClick={() => updateBookingDraft({ destination: undefined, distanceKm: undefined, durationMinutes: undefined, price: undefined })}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/55 px-4 text-xs font-semibold transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Route className="h-4 w-4" aria-hidden="true" />
                Curăță destinația
              </button>
            </div>
          </MapBottomSheet>
        </>
      )}
    </MapFirstPage>
  );
}
