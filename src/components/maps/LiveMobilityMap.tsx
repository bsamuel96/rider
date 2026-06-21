import { type LatLngExpression, type LatLngTuple } from "leaflet";
import { LocateFixed, Phone, ShieldAlert } from "lucide-react";
import { useEffect, useMemo } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import { MapActorMarker } from "@/components/maps/MapActorMarker";
import { MapEtaChip } from "@/components/maps/MapEtaChip";
import { MapFloatingButton } from "@/components/maps/MapFloatingButton";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { MapPaymentChip } from "@/components/maps/MapPaymentChip";
import { MapRatingPanel } from "@/components/maps/MapRatingPanel";
import { MapServiceDock } from "@/components/maps/MapServiceDock";
import { MapStatusPill } from "@/components/maps/MapStatusPill";
import { MapThemeToggle } from "@/components/maps/MapThemeToggle";
import { useStreetRoute } from "@/hooks/useStreetRoute";
import type { AuthInstance, BookingStatus, Coordinates, PaymentMethod, ServiceType } from "@/types/domain";
import { DEFAULT_CENTER, STATUS_LABELS, TILE_URL } from "@/utils/constants";
import { formatCurrency } from "@/utils/format";
import { formatEta } from "@/utils/geo";
import { cn } from "@/utils/cn";

type LiveMobilityMapProps = {
  userLocation?: Coordinates;
  pickupLocation?: Coordinates;
  destinationLocation?: Coordinates;
  driverLocation?: Coordinates;
  roadsideLocation?: Coordinates;
  activeRole: AuthInstance | "admin";
  serviceType?: ServiceType;
  status?: BookingStatus | "online" | "offline" | "new_request" | "accepted" | "completed";
  etaToPickupMinutes?: number;
  etaToDestinationMinutes?: number;
  distanceToPickupKm?: number;
  distanceToDestinationKm?: number;
  paymentMethod?: PaymentMethod;
  cashEnabled?: boolean;
  fareEstimate?: number;
  rating?: number;
  showMainActions?: boolean;
  showBottomControls?: boolean;
  showTopOverlay?: boolean;
  showBottomOverlay?: boolean;
  showServiceDock?: boolean;
  showPaymentChip?: boolean;
  minimal?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  portalLabel: string;
  actorLabel?: string;
  completed?: boolean;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onCashToggle?: () => void;
  onLocateMe?: () => void;
  onThemeToggle?: () => void;
  onRate?: (rating: number) => void;
  onServiceChange?: (serviceType: ServiceType) => void;
  className?: string;
};

function MapBounds({ points, mobilePadding }: { points: LatLngTuple[]; mobilePadding?: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      map.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 13);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    map.fitBounds(
      points,
      mobilePadding
        ? {
            paddingTopLeft: [32, 90],
            paddingBottomRight: [32, 360],
            maxZoom: 15
          }
        : {
            padding: [58, 58],
            maxZoom: 15
          }
    );
  }, [map, mobilePadding, points]);

  return null;
}

export function LiveMobilityMap({
  userLocation,
  pickupLocation,
  destinationLocation,
  driverLocation,
  roadsideLocation,
  activeRole,
  serviceType,
  status = "online",
  etaToPickupMinutes,
  etaToDestinationMinutes,
  distanceToPickupKm,
  distanceToDestinationKm,
  paymentMethod = "card",
  cashEnabled,
  fareEstimate = 42,
  rating,
  showMainActions = true,
  showBottomControls = true,
  showTopOverlay = true,
  showBottomOverlay,
  showServiceDock = true,
  showPaymentChip = true,
  minimal = false,
  primaryActionLabel = "Confirmă",
  secondaryActionLabel,
  portalLabel,
  actorLabel,
  completed,
  onPrimaryAction,
  onSecondaryAction,
  onCashToggle,
  onLocateMe,
  onThemeToggle,
  onRate,
  onServiceChange,
  className
}: LiveMobilityMapProps) {
  const points = [userLocation, pickupLocation, destinationLocation, driverLocation, roadsideLocation]
    .filter(Boolean)
    .map((point) => [point!.lat, point!.lng] as LatLngTuple);
  const hasRoadsideActor = serviceType === "tow" || serviceType === "roadside" || activeRole === "roadside";
  const routePair = useMemo(
    () =>
      getRoutePair({
        activeRole,
        serviceType,
        status,
        userLocation,
        pickupLocation,
        destinationLocation,
        driverLocation,
        roadsideLocation
      }),
    [activeRole, destinationLocation, driverLocation, pickupLocation, roadsideLocation, serviceType, status, userLocation]
  );
  const streetRoute = useStreetRoute({
    from: routePair?.from,
    to: routePair?.to,
    enabled: Boolean(routePair)
  });
  const route = streetRoute.routePoints.map((point) => [point.lat, point.lng] as LatLngTuple);
  const routeBounds = route.length >= 2 ? [...points, ...route] : points;
  const center: LatLngExpression = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
  const statusLabel = getStatusLabel(status);
  const routeTargetsPickup = routePair?.target === "pickup";
  const routeTargetsDestination = routePair?.target === "destination";
  const displayEtaToPickupMinutes = routeTargetsPickup ? streetRoute.durationMinutes || etaToPickupMinutes : etaToPickupMinutes;
  const displayDistanceToPickupKm = routeTargetsPickup ? streetRoute.distanceKm || distanceToPickupKm : distanceToPickupKm;
  const displayEtaToDestinationMinutes = routeTargetsDestination
    ? streetRoute.durationMinutes || etaToDestinationMinutes
    : etaToDestinationMinutes;
  const displayDistanceToDestinationKm = routeTargetsDestination
    ? streetRoute.distanceKm || distanceToDestinationKm
    : distanceToDestinationKm;
  const routeProviderLabel =
    streetRoute.provider === "osrm" ? "Rută stradală" : streetRoute.provider === "fallback" ? "Rută estimată" : undefined;
  const routeIsFallback = streetRoute.provider === "fallback";
  const shouldShowBottomOverlay = showBottomOverlay ?? showBottomControls;

  return (
    <div
      className={cn(
        "relative h-[100svh] min-h-[520px] overflow-hidden bg-muted lg:h-[calc(100vh-4rem)]",
        minimal && "map-booking-mobile",
        className
      )}
    >
      <MapContainer center={center} zoom={13} scrollWheelZoom className="absolute inset-0 z-0 h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={TILE_URL}
        />
        <MapBounds points={routeBounds} mobilePadding={minimal} />
        {route.length >= 2 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#0f172a",
                weight: 8,
                opacity: 0.22,
                dashArray: routeIsFallback ? "8 10" : undefined
              }}
            />
            <Polyline
              positions={route}
              pathOptions={{
                color: "#14b8a6",
                weight: 5,
                opacity: 0.9,
                dashArray: routeIsFallback ? "8 10" : undefined
              }}
            />
          </>
        )}
        <MapActorMarker type="user" position={userLocation} label="Tu" pulse />
        <MapActorMarker type="pickup" position={pickupLocation} label="Pickup" />
        <MapActorMarker type="destination" position={destinationLocation} label="Destinație" />
        <MapActorMarker
          type="driver"
          position={driverLocation}
          label={actorLabel || "Șofer"}
          etaLabel={!hasRoadsideActor ? formatEta(displayEtaToPickupMinutes) : undefined}
          heading={25}
        />
        <MapActorMarker
          type={serviceType === "tow" ? "tow" : "roadside"}
          position={roadsideLocation}
          label={serviceType === "tow" ? "Platformă" : "Asistență"}
          etaLabel={hasRoadsideActor ? formatEta(displayEtaToPickupMinutes) : undefined}
        />
      </MapContainer>

      {showTopOverlay && (
      <div className="pointer-events-none absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[500] flex items-start justify-between gap-3 md:inset-x-5">
        <div className="pointer-events-auto space-y-2">
          <MapFloatingPanel className="px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground">{portalLabel}</p>
            <p className="text-sm font-semibold">{getRoleHeadline(activeRole, serviceType)}</p>
          </MapFloatingPanel>
          <div className="flex flex-wrap gap-2">
            <MapStatusPill label={statusLabel} tone={status === "online" || status === "confirmed" ? "success" : status === "new_request" ? "warning" : "default"} />
            {rating && <MapStatusPill label={`${rating.toFixed(2)} ★`} />}
            {routeProviderLabel && (
              <MapStatusPill
                label={streetRoute.loading ? "Calcul rută" : routeProviderLabel}
                tone={streetRoute.provider === "osrm" ? "success" : "warning"}
              />
            )}
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col gap-2">
          <MapThemeToggle onToggle={onThemeToggle} />
          <MapFloatingButton aria-label="Localizează-mă" title="Localizează-mă" onClick={onLocateMe}>
            <LocateFixed className="h-4 w-4" />
          </MapFloatingButton>
        </div>
      </div>
      )}

      {shouldShowBottomOverlay && (
      <div className="pointer-events-none absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[540] space-y-2 md:inset-x-auto md:bottom-5 md:left-5 md:w-[420px]">
        <div className="pointer-events-auto flex flex-wrap gap-2">
          <MapEtaChip
            label={hasRoadsideActor ? "Echipaj" : "Șofer"}
            minutes={displayEtaToPickupMinutes}
            distanceKm={displayDistanceToPickupKm}
          />
          {displayEtaToDestinationMinutes !== undefined && (
            <MapEtaChip
              label="Destinație"
              minutes={displayEtaToDestinationMinutes}
              distanceKm={displayDistanceToDestinationKm}
            />
          )}
          {showPaymentChip && (
            <MapPaymentChip
              paymentMethod={paymentMethod}
              fareEstimate={fareEstimate}
              cashEnabled={cashEnabled}
              onClick={onCashToggle}
            />
          )}
        </div>

        {completed ? (
          <div className="pointer-events-auto">
            <MapRatingPanel roadside={hasRoadsideActor} onRate={onRate} />
          </div>
        ) : (
          <>
            {showServiceDock && onServiceChange && (
              <div className="pointer-events-auto">
                <MapServiceDock value={serviceType} onChange={onServiceChange} />
              </div>
            )}

            {showMainActions && (
              <MapFloatingPanel className="pointer-events-auto space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{primaryActionLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {paymentMethod === "cash" ? `Cash · ${formatCurrency(fareEstimate)}` : `Card · ${formatCurrency(fareEstimate)}`}
                    </p>
                  </div>
                  {activeRole !== "customer" && (
                    <MapFloatingButton aria-label="Sună clientul" title="Sună clientul">
                      <Phone className="h-4 w-4" />
                    </MapFloatingButton>
                  )}
                  {activeRole === "customer" && (
                    <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {primaryActionLabel}
                  </button>
                  {secondaryActionLabel && (
                    <button
                      type="button"
                      onClick={onSecondaryAction}
                      className="min-h-12 rounded-xl border bg-background/70 px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {secondaryActionLabel}
                    </button>
                  )}
                </div>
              </MapFloatingPanel>
            )}
          </>
        )}
      </div>
      )}
    </div>
  );
}

type RoutePair = {
  from: Coordinates;
  to: Coordinates;
  target: "pickup" | "destination";
};

function getRoutePair(params: {
  activeRole: LiveMobilityMapProps["activeRole"];
  serviceType?: ServiceType;
  status: LiveMobilityMapProps["status"];
  userLocation?: Coordinates;
  pickupLocation?: Coordinates;
  destinationLocation?: Coordinates;
  driverLocation?: Coordinates;
  roadsideLocation?: Coordinates;
}): RoutePair | undefined {
  const isRoadsideService =
    params.serviceType === "tow" || params.serviceType === "roadside" || params.activeRole === "roadside";

  if (params.status === "driver_en_route" && !isRoadsideService && params.driverLocation && params.pickupLocation) {
    return {
      from: params.driverLocation,
      to: params.pickupLocation,
      target: "pickup"
    };
  }

  if (
    isRoadsideService &&
    params.roadsideLocation &&
    params.pickupLocation &&
    (params.status === "driver_en_route" || params.status === "accepted" || params.status === "new_request")
  ) {
    return {
      from: params.roadsideLocation,
      to: params.pickupLocation,
      target: "pickup"
    };
  }

  if (params.pickupLocation && params.destinationLocation) {
    return {
      from: params.pickupLocation,
      to: params.destinationLocation,
      target: "destination"
    };
  }

  if (params.userLocation && params.destinationLocation) {
    return {
      from: params.userLocation,
      to: params.destinationLocation,
      target: "destination"
    };
  }

  return undefined;
}

function getStatusLabel(status: LiveMobilityMapProps["status"]) {
  if (!status) {
    return "Online";
  }

  if (status in STATUS_LABELS) {
    return STATUS_LABELS[status as BookingStatus];
  }

  const labels: Record<string, string> = {
    online: "Online",
    offline: "Offline",
    new_request: "Solicitare nouă",
    accepted: "Acceptat",
    completed: "Finalizat"
  };

  return labels[status] || "Online";
}

function getRoleHeadline(role: LiveMobilityMapProps["activeRole"], serviceType?: ServiceType) {
  if (role === "driver") {
    return "Curse live";
  }

  if (role === "roadside") {
    return serviceType === "tow" ? "Dispatch platformă" : "Dispatch roadside";
  }

  if (role === "admin") {
    return "Control operațional";
  }

  return "Harta ta live";
}
