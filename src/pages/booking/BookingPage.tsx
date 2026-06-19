import { CheckCircle2, CreditCard, MapPinned, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useLiveActorLocations } from "@/hooks/useLiveActorLocations";
import { usePaymentState } from "@/hooks/usePaymentState";
import { calculateBookingEstimate } from "@/services/pricing";
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
  const bookingDraft = useAppStore((state) => state.bookingDraft);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const pushNotification = useAppStore((state) => state.pushNotification);
  const payment = usePaymentState();
  const serviceType = bookingDraft.serviceType || "standard";
  const actors = useLiveActorLocations({
    pickupLocation: bookingDraft.pickup,
    destinationLocation: bookingDraft.destination,
    serviceType
  });
  const fareEstimate = bookingDraft.fareEstimate || bookingDraft.price || fallbackFare[serviceType];

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

  const canConfirm = Boolean(bookingDraft.pickup && bookingDraft.destination && bookingDraft.serviceType);

  const confirm = () => {
    if (!canConfirm) {
      return;
    }

    pushNotification({
      id: crypto.randomUUID(),
      title: "Comandă trimisă",
      body: payment.paymentMethod === "cash" ? "Căutăm șofer. Plata cash va fi confirmată la final." : "Căutăm cel mai apropiat șofer disponibil.",
      read: false,
      createdAt: new Date().toISOString()
    });
    navigate("/customer/tracking/demo");
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
        secondaryActionLabel="Curăță"
        onPrimaryAction={confirm}
        onSecondaryAction={() => updateBookingDraft({ destination: undefined, distanceKm: undefined, durationMinutes: undefined, price: undefined })}
        onCashToggle={payment.togglePaymentMethod}
        onServiceChange={(nextService) => updateEstimate({ serviceType: nextService })}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <MapFloatingPanel className="absolute inset-x-3 top-[7rem] z-[520] space-y-3 p-3 md:left-5 md:right-auto md:w-[430px]">
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

      <aside className="pointer-events-none absolute right-5 top-24 z-[520] hidden w-[360px] space-y-3 xl:block">
        <MapFloatingPanel className="pointer-events-auto space-y-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Route className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-semibold">Confirmare cursă</h1>
              <p className="mt-1 text-sm text-muted-foreground">Alege traseul, serviciul și metoda de plată direct peste hartă.</p>
            </div>
          </div>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Pickup</dt>
              <dd className="max-w-[58%] truncate font-medium">{bookingDraft.pickup?.label || "Neales"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Destinație</dt>
              <dd className="max-w-[58%] truncate font-medium">{bookingDraft.destination?.label || "Nealeasă"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Distanță</dt>
              <dd className="font-medium">{formatDistance(bookingDraft.distanceKm)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Durată</dt>
              <dd className="font-medium">{bookingDraft.durationMinutes || actors.etaToDestinationMinutes || 0} min</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Cost</dt>
              <dd className="font-semibold">{formatCurrency(fareEstimate)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Plată</dt>
              <dd className="inline-flex items-center gap-2 font-medium">
                <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
                {payment.paymentMethod === "cash" ? "Cash" : "Card"}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={confirm}
            disabled={!canConfirm}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Confirmă
          </button>
        </MapFloatingPanel>

        <MapFloatingPanel className="pointer-events-auto flex items-center gap-3">
          <MapPinned className="h-4 w-4 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">ETA este aproximativ, calculat pe distanță urbană.</p>
        </MapFloatingPanel>
      </aside>
    </MapFirstPage>
  );
}
