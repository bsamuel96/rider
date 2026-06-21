import { ArrowRight, BadgeCheck, Clock3, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapStatusPill } from "@/components/maps/MapStatusPill";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useLiveActorLocations } from "@/hooks/useLiveActorLocations";
import { usePaymentState } from "@/hooks/usePaymentState";
import { useAppStore } from "@/store/useAppStore";
import type { ServiceType } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

const serviceFallbackFare: Record<ServiceType, number> = {
  standard: 42,
  premium: 68,
  tow: 180,
  roadside: 95
};

export function CustomerDashboardPage() {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);
  const bookingDraft = useAppStore((state) => state.bookingDraft);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const payment = usePaymentState();
  const serviceType = bookingDraft.serviceType || "standard";
  const actorLocations = useLiveActorLocations({
    pickupLocation: bookingDraft.pickup,
    destinationLocation: bookingDraft.destination,
    serviceType
  });
  const fareEstimate = bookingDraft.fareEstimate || bookingDraft.price || serviceFallbackFare[serviceType];
  const firstName = profile?.fullName?.split(" ")[0] || "Tarzan";

  const selectService = (nextService: ServiceType) => {
    updateBookingDraft({
      serviceType: nextService,
      fareEstimate: bookingDraft.price || serviceFallbackFare[nextService],
      currency: "RON"
    });
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        portalLabel={`Salut, ${firstName}`}
        activeRole="customer"
        serviceType={serviceType}
        status="online"
        userLocation={actorLocations.userLocation}
        pickupLocation={bookingDraft.pickup || actorLocations.userLocation}
        destinationLocation={bookingDraft.destination}
        driverLocation={actorLocations.driverLocation}
        roadsideLocation={actorLocations.roadsideLocation}
        etaToPickupMinutes={actorLocations.etaToPickupMinutes}
        etaToDestinationMinutes={actorLocations.etaToDestinationMinutes}
        distanceToPickupKm={actorLocations.distanceToPickupKm}
        distanceToDestinationKm={actorLocations.distanceToDestinationKm}
        paymentMethod={payment.paymentMethod}
        cashEnabled={payment.paymentMethod === "cash"}
        fareEstimate={fareEstimate}
        rating={4.9}
        primaryActionLabel={bookingDraft.destination ? "Confirmă cursa" : "Alege destinația"}
        secondaryActionLabel="Roadside"
        onPrimaryAction={() => navigate("/customer/booking")}
        onSecondaryAction={() => navigate("/customer/roadside")}
        onServiceChange={selectService}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <button
        type="button"
        onClick={() => navigate("/customer/booking")}
        className="absolute inset-x-3 top-[7.25rem] z-[520] flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/90 px-4 text-left shadow-floating backdrop-blur-xl transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:left-5 md:right-auto md:w-[420px]"
      >
        <span>
          <span className="block text-sm font-semibold">Unde mergi?</span>
          <span className="block text-xs text-muted-foreground">
            {bookingDraft.destination?.label || "Alege destinația și vezi ETA pe hartă"}
          </span>
        </span>
        <ArrowRight className="h-5 w-5 text-primary" aria-hidden="true" />
      </button>

      <div className="absolute inset-x-3 top-[11.75rem] z-[520] md:left-5 md:right-auto md:w-[420px]">
        <PaymentMethodSelector
          compact
          value={payment.paymentMethod}
          onChange={payment.setPaymentMethod}
          fareEstimate={fareEstimate}
        />
      </div>

      <aside className="pointer-events-none absolute right-5 top-24 z-[520] hidden w-[360px] space-y-3 xl:block">
        <MapFloatingPanel className="pointer-events-auto space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Client</p>
            <h1 className="mt-1 text-xl font-semibold">Comandă rapidă de pe hartă</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Locația, serviciul, plata și următoarea acțiune rămân vizibile fără dashboard aglomerat.
            </p>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                ETA actor
              </span>
              <strong>~{actorLocations.etaToPickupMinutes} min</strong>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Plată
              </span>
              <strong>{payment.paymentMethod === "cash" ? "Cash" : "Card"} · {formatCurrency(fareEstimate)}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 p-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 text-primary" />
                Șoferi disponibili
              </span>
              <strong>4.9 ★</strong>
            </div>
          </div>
        </MapFloatingPanel>

        <MapFloatingPanel className="pointer-events-auto flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Demo realtime activ
          </span>
          <MapStatusPill label="Simulat" />
        </MapFloatingPanel>
      </aside>
    </MapFirstPage>
  );
}
