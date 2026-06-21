import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DriverActiveRideSheet } from "@/components/driver/DriverActiveRideSheet";
import { DriverStatusStrip } from "@/components/driver/DriverStatusStrip";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { createDemoDriverOffer } from "@/hooks/useDriverRideOffers";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import type { DriverActiveBooking } from "@/types/domain";
import { DEFAULT_CENTER } from "@/utils/constants";

export function DriverRideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sequence = Math.max(0, Number(id?.replace(/\D/g, "")) - 1 || 0);
  const offer = useMemo(() => createDemoDriverOffer(DEFAULT_CENTER, sequence), [sequence]);
  const booking: DriverActiveBooking = {
    ...offer,
    status: "en_route_to_pickup",
    cashStatus: offer.paymentMethod === "cash" ? "pending_collection" : "not_required"
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        minimal
        portalLabel="Șofer"
        activeRole="driver"
        serviceType={booking.serviceType}
        status="driver_en_route"
        pickupLocation={booking.pickup}
        destinationLocation={booking.destination}
        driverLocation={DEFAULT_CENTER}
        etaToPickupMinutes={booking.etaToPickupMinutes}
        etaToDestinationMinutes={booking.etaToDestinationMinutes}
        distanceToPickupKm={booking.distanceToPickupKm}
        distanceToDestinationKm={booking.routeDistanceKm}
        paymentMethod={booking.paymentMethod}
        cashEnabled={booking.paymentMethod === "cash"}
        fareEstimate={booking.fareEstimate}
        showTopOverlay={false}
        showBottomOverlay={false}
        showServiceDock={false}
        showPaymentChip={false}
        showMainActions={false}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <DriverStatusStrip status="en_route_to_pickup" todayEarnings={0} rating={4.96} online />

      <div className="pointer-events-none absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[560] md:left-5 md:right-auto md:bottom-5 md:w-[420px]">
        <div className="pointer-events-auto">
          <DriverActiveRideSheet
            booking={booking}
            status="en_route_to_pickup"
            primaryAction={{ id: "back-to-live", label: "Deschide workflow live" }}
            etaToPickupMinutes={booking.etaToPickupMinutes}
            etaToDestinationMinutes={booking.etaToDestinationMinutes}
            distanceToDestinationKm={booking.routeDistanceKm}
            onPrimaryAction={() => navigate("/driver")}
            onCancelRide={() => navigate("/driver/rides")}
          />
        </div>
      </div>
    </MapFirstPage>
  );
}
