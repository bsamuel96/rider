import { useState } from "react";
import { DriverAvailableSheet } from "@/components/driver/DriverAvailableSheet";
import { DriverCancelRideDialog } from "@/components/driver/DriverCancelRideDialog";
import { DriverCashSheet } from "@/components/driver/DriverCashSheet";
import { DriverHomeMapControls } from "@/components/driver/DriverHomeMapControls";
import { DriverMapLayerSheet } from "@/components/driver/DriverMapLayerSheet";
import { DriverMenuDrawer } from "@/components/driver/DriverMenuDrawer";
import { DriverOfflineSheet } from "@/components/driver/DriverOfflineSheet";
import { DriverOfferSheet } from "@/components/driver/DriverOfferSheet";
import { DriverPickupSheet } from "@/components/driver/DriverPickupSheet";
import { DriverPreferencesSheet } from "@/components/driver/DriverPreferencesSheet";
import { DriverPreflightPanel } from "@/components/driver/DriverPreflightPanel";
import { DriverRatingSheet } from "@/components/driver/DriverRatingSheet";
import { DriverSafetyCenterSheet } from "@/components/driver/DriverSafetyCenterSheet";
import { DriverTripSheet } from "@/components/driver/DriverTripSheet";
import { DriverWaitingSheet } from "@/components/driver/DriverWaitingSheet";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { AppSplashScreen } from "@/components/splash/AppSplashScreen";
import { Button } from "@/components/ui/button";
import { useDriverWorkflow } from "@/hooks/useDriverWorkflow";
import { useRoleSplash } from "@/hooks/useRoleSplash";
import { useToast } from "@/hooks/useToast";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import type { BookingStatus, DriverWorkflowStatus } from "@/types/domain";

export function DriverPage() {
  const workflow = useDriverWorkflow();
  const showSplash = useRoleSplash("driver");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [locateRequestKey, setLocateRequestKey] = useState(0);
  const { toast } = useToast();
  const activeServiceType = workflow.activeBooking?.serviceType ?? workflow.activeOffer?.serviceType ?? "standard";

  const closeCancelDialog = () => setCancelDialogOpen(false);
  const cancelRide = (reason: string) => {
    workflow.cancelRide(reason);
    setCancelDialogOpen(false);
  };

  if (showSplash) {
    return <AppSplashScreen role="driver" />;
  }

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
        showFloatingControls={false}
        showMainActions={false}
        locateRequestKey={locateRequestKey}
        onLocateMe={() =>
          toast({
            title: "Poziție actualizată",
            description: "Harta a fost centrată pe locația GPS curentă.",
            tone: "success"
          })
        }
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <DriverDemandZones />

      <DriverHomeMapControls
        status={workflow.status}
        todayEarnings={workflow.todayEarnings}
        onMenu={() => setMenuOpen(true)}
        onSafety={() => setSafetyOpen(true)}
        onLocate={() => setLocateRequestKey((value) => value + 1)}
        onLayers={() => setLayersOpen(true)}
        onPreferences={() => setPreferencesOpen(true)}
      />

      <MinimizableBottomSheet
        title={getDriverSheetTitle(workflow.status)}
        description={getDriverSheetDescription(workflow.status)}
        initialState={workflow.status === "offline" ? "collapsed" : "half"}
        minimizedLabel={workflow.primaryAction?.label || "Panou șofer"}
        compactContent={<DriverCompactPanel workflow={workflow} onPrimaryAction={workflow.performPrimaryAction} />}
      >
        {renderDriverSheet({ workflow, onOpenCancel: () => setCancelDialogOpen(true) })}
      </MinimizableBottomSheet>

      <DriverMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <DriverSafetyCenterSheet open={safetyOpen} onClose={() => setSafetyOpen(false)} />
      <DriverPreferencesSheet open={preferencesOpen} onClose={() => setPreferencesOpen(false)} />
      <DriverMapLayerSheet open={layersOpen} onClose={() => setLayersOpen(false)} />
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

function getDriverSheetTitle(status: DriverWorkflowStatus) {
  if (status === "offline") {
    return "Ești offline";
  }

  if (status === "preflight") {
    return "Checklist tură";
  }

  if (status === "available") {
    return "Feed operațional";
  }

  if (status === "offer_received") {
    return "Solicitare nouă";
  }

  if (status === "cash_collection_required") {
    return "Încasează cash";
  }

  if (status === "rating_customer") {
    return "Evaluează pasagerul";
  }

  return "Cursă activă";
}

function getDriverSheetDescription(status: DriverWorkflowStatus) {
  if (status === "available") {
    return "Campanii, sugestii și stare live. Minimizează panoul pentru focus pe hartă.";
  }

  if (status === "offline") {
    return "Intră online când ești pregătit să primești cereri.";
  }

  return "Următoarea acțiune rămâne disponibilă fără să acopere harta.";
}

function DriverCompactPanel({
  workflow,
  onPrimaryAction
}: {
  workflow: ReturnType<typeof useDriverWorkflow>;
  onPrimaryAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{workflow.primaryAction?.label || getDriverSheetTitle(workflow.status)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {workflow.online ? `${workflow.rating.toFixed(2)} ★ · ${workflow.status}` : "Tură oprită"}
        </p>
      </div>
      <Button type="button" size="sm" onClick={onPrimaryAction}>
        {workflow.status === "offline" ? "Intră online" : workflow.primaryAction?.label || "Continuă"}
      </Button>
    </div>
  );
}

function DriverDemandZones() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
      <span className="absolute left-[18%] top-[24%] h-28 w-36 rounded-[42%] border border-primary/40 bg-primary/12 blur-[1px]" />
      <span className="absolute right-[18%] top-[34%] h-24 w-32 rounded-[44%] border border-amber-500/40 bg-amber-500/14 blur-[1px]" />
      <span className="absolute bottom-[32%] left-[38%] h-20 w-28 rounded-[46%] border border-sky-500/35 bg-sky-500/12 blur-[1px]" />
    </div>
  );
}
