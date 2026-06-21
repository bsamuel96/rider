import { useState } from "react";
import { DriverAvailableSheet } from "@/components/driver/DriverAvailableSheet";
import { DriverCancelRideDialog } from "@/components/driver/DriverCancelRideDialog";
import { DriverCashSheet } from "@/components/driver/DriverCashSheet";
import { DriverOfflineSheet } from "@/components/driver/DriverOfflineSheet";
import { DriverOfferSheet } from "@/components/driver/DriverOfferSheet";
import { DriverPickupSheet } from "@/components/driver/DriverPickupSheet";
import { DriverPreflightPanel } from "@/components/driver/DriverPreflightPanel";
import { DriverRatingSheet } from "@/components/driver/DriverRatingSheet";
import { DriverStatusStrip } from "@/components/driver/DriverStatusStrip";
import { DriverTripSheet } from "@/components/driver/DriverTripSheet";
import { DriverWaitingSheet } from "@/components/driver/DriverWaitingSheet";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { useDriverWorkflow } from "@/hooks/useDriverWorkflow";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import type { BookingStatus, DriverWorkflowStatus } from "@/types/domain";

export function DriverPage() {
  const workflow = useDriverWorkflow();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const activeServiceType = workflow.activeBooking?.serviceType ?? workflow.activeOffer?.serviceType ?? "standard";

  const closeCancelDialog = () => setCancelDialogOpen(false);
  const cancelRide = (reason: string) => {
    workflow.cancelRide(reason);
    setCancelDialogOpen(false);
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        minimal
        portalLabel="Șofer"
        activeRole="driver"
        serviceType={activeServiceType}
        status={mapDriverStatusToMapStatus(workflow.status)}
        pickupLocation={workflow.locations.pickup}
        destinationLocation={workflow.locations.destination}
        driverLocation={workflow.locations.driver}
        etaToPickupMinutes={workflow.etas.toPickupMinutes}
        etaToDestinationMinutes={workflow.etas.toDestinationMinutes}
        distanceToPickupKm={workflow.distances.toPickupKm}
        distanceToDestinationKm={workflow.distances.toDestinationKm}
        paymentMethod={workflow.payment.method}
        cashEnabled={workflow.payment.method === "cash"}
        fareEstimate={workflow.payment.fare}
        rating={workflow.rating}
        showTopOverlay={false}
        showBottomOverlay={false}
        showServiceDock={false}
        showPaymentChip={false}
        showMainActions={false}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <DriverStatusStrip
        status={workflow.status}
        todayEarnings={workflow.todayEarnings}
        rating={workflow.rating}
        online={workflow.online}
      />

      <div className="pointer-events-none absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[560] md:left-5 md:right-auto md:bottom-5 md:w-[420px]">
        <div className="pointer-events-auto">{renderDriverSheet({ workflow, onOpenCancel: () => setCancelDialogOpen(true) })}</div>
      </div>

      <DriverCancelRideDialog open={cancelDialogOpen} onClose={closeCancelDialog} onCancelRide={cancelRide} />
    </MapFirstPage>
  );
}

type DriverSheetRenderArgs = {
  workflow: ReturnType<typeof useDriverWorkflow>;
  onOpenCancel: () => void;
};

function renderDriverSheet({ workflow, onOpenCancel }: DriverSheetRenderArgs) {
  if (workflow.status === "offline") {
    return <DriverOfflineSheet onGoOnline={workflow.goOnline} />;
  }

  if (workflow.status === "preflight") {
    return <DriverPreflightPanel onReady={workflow.goOnline} onGoOffline={workflow.goOffline} />;
  }

  if (workflow.status === "available") {
    return <DriverAvailableSheet shift={workflow.shiftSummary} onGoOffline={workflow.goOffline} />;
  }

  if (workflow.status === "offer_received" && workflow.activeOffer) {
    return (
      <DriverOfferSheet
        offer={workflow.activeOffer}
        countdownSeconds={workflow.offerCountdownSeconds}
        onAccept={workflow.acceptOffer}
        onReject={workflow.rejectOffer}
      />
    );
  }

  if (!workflow.activeBooking) {
    return <DriverAvailableSheet shift={workflow.shiftSummary} onGoOffline={workflow.goOffline} />;
  }

  const activeRideProps = {
    booking: workflow.activeBooking,
    status: workflow.status,
    primaryAction: workflow.primaryAction,
    etaToPickupMinutes: workflow.etas.toPickupMinutes,
    etaToDestinationMinutes: workflow.etas.toDestinationMinutes,
    distanceToDestinationKm: workflow.distances.toDestinationKm,
    onPrimaryAction: workflow.performPrimaryAction,
    onCancelRide: onOpenCancel
  };

  if (["offer_accepted", "en_route_to_pickup", "arrived_at_pickup"].includes(workflow.status)) {
    return <DriverPickupSheet {...activeRideProps} />;
  }

  if (workflow.status === "waiting_for_customer") {
    return <DriverWaitingSheet {...activeRideProps} />;
  }

  if (workflow.status === "cash_collection_required") {
    return <DriverCashSheet booking={workflow.activeBooking} onCollected={workflow.markCashCollected} />;
  }

  if (workflow.status === "rating_customer") {
    return <DriverRatingSheet booking={workflow.activeBooking} onSubmit={workflow.rateCustomer} />;
  }

  return <DriverTripSheet {...activeRideProps} />;
}

function mapDriverStatusToMapStatus(status: DriverWorkflowStatus): BookingStatus | "online" | "offline" | "new_request" {
  if (status === "offline" || status === "preflight" || status === "suspended") {
    return "offline";
  }

  if (status === "available") {
    return "online";
  }

  if (status === "offer_received") {
    return "new_request";
  }

  if (["offer_accepted", "en_route_to_pickup", "arrived_at_pickup"].includes(status)) {
    return "driver_en_route";
  }

  if (["waiting_for_customer", "trip_started"].includes(status)) {
    return "confirmed";
  }

  if (status === "en_route_to_destination") {
    return "in_progress";
  }

  if (status === "arrived_at_destination") {
    return "arrived";
  }

  if (["trip_completed", "cash_collection_required", "cash_collected", "rating_customer"].includes(status)) {
    return "completed";
  }

  return "online";
}
