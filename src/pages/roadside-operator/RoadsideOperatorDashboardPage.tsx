import { useMemo, useState } from "react";
import { Banknote, CheckCircle2, Headphones, Phone, RadioTower, Star, Truck, Wrench } from "lucide-react";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapFloatingButton } from "@/components/maps/MapFloatingButton";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapStatusPill } from "@/components/maps/MapStatusPill";
import { NavigateToCustomerButton } from "@/components/navigation/NavigateToCustomerButton";
import { CashCollectionPanel } from "@/components/payment/CashCollectionPanel";
import { RoadsideGuaranteeBanner } from "@/components/roadside/RoadsideGuaranteeBanner";
import { Button } from "@/components/ui/button";
import { AppSplashScreen } from "@/components/splash/AppSplashScreen";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useRoleSplash } from "@/hooks/useRoleSplash";
import type { BookingStatus, CashStatus, Coordinates, RoadsideRequestStatus } from "@/types/domain";
import { estimateEtaMinutes, haversineDistanceKm } from "@/utils/geo";

export function RoadsideOperatorDashboardPage() {
  const { position } = useGeolocation();
  const showSplash = useRoleSplash("roadside");
  const [online, setOnline] = useState(true);
  const [step, setStep] = useState(0);
  const [requestStatus, setRequestStatus] = useState<RoadsideRequestStatus>("searching");
  const [fastGuaranteeApplied] = useState(false);
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
  const currentStatus = online ? mapRoadsideStatusToMapStatus(requestStatus) : "offline";
  const actionLabel = online ? getOperatorActionLabel(requestStatus) : "Devino disponibil";

  const advance = () => {
    if (!online) {
      setOnline(true);
      return;
    }

    if (requestStatus === "searching" || requestStatus === "accepted") {
      setRequestStatus("operator_en_route");
      setStep(1);
      return;
    }

    if (requestStatus === "operator_en_route") {
      setRequestStatus("operator_arrived_pending_customer");
      setStep(2);
      return;
    }

    if (requestStatus === "operator_arrived_confirmed") {
      setRequestStatus("issue_in_progress");
      setStep(3);
      return;
    }

    if (requestStatus === "issue_in_progress") {
      setRequestStatus("issue_solved_pending_customer");
      setStep(4);
    }
  };

  if (showSplash) {
    return <AppSplashScreen role="roadside" />;
  }

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
          {step >= 1 && (
            <NavigateToCustomerButton
              coordinates={clientLocation}
              label="Client roadside"
              compact
              className="pt-1"
            >
              Navighează la client
            </NavigateToCustomerButton>
          )}
          {requestStatus === "operator_arrived_pending_customer" && (
            <p className="rounded-xl bg-amber-500/12 p-3 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Așteptăm confirmarea clientului.
            </p>
          )}
          {requestStatus === "issue_solved_pending_customer" && (
            <p className="rounded-xl bg-amber-500/12 p-3 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Așteptăm confirmarea clientului pentru rezolvare.
            </p>
          )}
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
          <RoadsideGuaranteeBanner status={fastGuaranteeApplied ? "applied" : "active"} remainingMinutes={18} operatorView />
          {step >= 1 && (
            <NavigateToCustomerButton coordinates={clientLocation} label="Client roadside">
              Navighează la client
            </NavigateToCustomerButton>
          )}
          {requestStatus === "operator_arrived_pending_customer" && (
            <Button type="button" variant="outline" onClick={() => setRequestStatus("operator_arrived_confirmed")}>
              Demo: clientul a confirmat sosirea
            </Button>
          )}
          {requestStatus === "issue_solved_pending_customer" && (
            <Button type="button" variant="outline" onClick={() => setRequestStatus("completed")}>
              Demo: clientul a confirmat rezolvarea
            </Button>
          )}
          <button
            type="button"
            onClick={advance}
            disabled={requestStatus === "operator_arrived_pending_customer" || requestStatus === "issue_solved_pending_customer" || requestStatus === "completed"}
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

function getOperatorActionLabel(status: RoadsideRequestStatus) {
  const labels: Partial<Record<RoadsideRequestStatus, string>> = {
    searching: "Acceptă intervenția",
    accepted: "Merg spre client",
    operator_en_route: "Am ajuns la client",
    operator_arrived_pending_customer: "Așteptăm confirmarea clientului",
    operator_arrived_confirmed: "Încep intervenția",
    issue_in_progress: "Problema este rezolvată",
    issue_solved_pending_customer: "Așteptăm confirmarea clientului",
    completed: "Finalizat",
    disputed: "Dispută în review"
  };

  return labels[status] || "Continuă";
}

function mapRoadsideStatusToMapStatus(status: RoadsideRequestStatus): BookingStatus | "new_request" | "accepted" {
  if (status === "searching") {
    return "new_request";
  }

  if (status === "operator_en_route") {
    return "driver_en_route";
  }

  if (status === "operator_arrived_pending_customer" || status === "operator_arrived_confirmed") {
    return "arrived";
  }

  if (status === "issue_in_progress" || status === "issue_solved_pending_customer") {
    return "in_progress";
  }

  if (status === "completed" || status === "issue_solved_confirmed") {
    return "completed";
  }

  return "accepted";
}
