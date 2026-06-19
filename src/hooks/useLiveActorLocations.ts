import { useMemo } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getEtaModeForService, haversineDistanceKm, estimateEtaMinutes } from "@/utils/geo";
import type { Coordinates, ServiceType } from "@/types/domain";

type UseLiveActorLocationsOptions = {
  pickupLocation?: Coordinates;
  destinationLocation?: Coordinates;
  serviceType?: ServiceType;
};

export function useLiveActorLocations({
  pickupLocation,
  destinationLocation,
  serviceType
}: UseLiveActorLocationsOptions = {}) {
  const { position, loading } = useGeolocation();
  const pickup = pickupLocation || position;

  const driverLocation = useMemo<Coordinates>(
    () => ({
      lat: pickup.lat + 0.014,
      lng: pickup.lng - 0.012
    }),
    [pickup.lat, pickup.lng]
  );

  const roadsideLocation = useMemo<Coordinates>(
    () => ({
      lat: pickup.lat - 0.019,
      lng: pickup.lng + 0.016
    }),
    [pickup.lat, pickup.lng]
  );

  const activeActor = serviceType === "tow" || serviceType === "roadside" ? roadsideLocation : driverLocation;
  const distanceToPickupKm = haversineDistanceKm(activeActor, pickup);
  const etaToPickupMinutes = estimateEtaMinutes(distanceToPickupKm, getEtaModeForService(serviceType));
  const distanceToDestinationKm = destinationLocation ? haversineDistanceKm(pickup, destinationLocation) : undefined;
  const etaToDestinationMinutes = distanceToDestinationKm
    ? estimateEtaMinutes(distanceToDestinationKm, "active_ride")
    : undefined;

  return {
    userLocation: position,
    driverLocation,
    roadsideLocation,
    etaToPickupMinutes,
    etaToDestinationMinutes,
    distanceToPickupKm,
    distanceToDestinationKm,
    isRealtime: false,
    lastUpdatedAt: loading ? undefined : new Date().toISOString()
  };
}
