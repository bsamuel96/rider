import type { Coordinates, ServiceType } from "@/types/domain";

export type EtaMode = "driver_to_pickup" | "roadside_to_pickup" | "tow_to_pickup" | "active_ride";

export function haversineDistanceKm(a: Coordinates, b: Coordinates) {
  const radiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * radiusKm * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function estimateEtaMinutes(distanceKm: number, mode: EtaMode) {
  const speedKmh = mode === "active_ride" ? 30 : mode === "roadside_to_pickup" || mode === "tow_to_pickup" ? 28 : 24;
  const routeFactor = mode === "active_ride" ? 1.25 : 1.18;
  const buffer = mode === "tow_to_pickup" ? 3 : mode === "roadside_to_pickup" ? 2 : 0;
  const minutes = (distanceKm * routeFactor * 60) / speedKmh + buffer;

  return Math.max(1, Math.ceil(minutes));
}

export function getEtaModeForService(serviceType?: ServiceType): EtaMode {
  if (serviceType === "tow") {
    return "tow_to_pickup";
  }

  if (serviceType === "roadside") {
    return "roadside_to_pickup";
  }

  return "driver_to_pickup";
}

export function formatEta(minutes?: number) {
  if (!minutes) {
    return "~1 min";
  }

  return minutes > 9 ? `aprox. ${minutes} min` : `~${minutes} min`;
}

export function formatDistanceKm(distanceKm?: number) {
  if (!distanceKm) {
    return "la 0 km";
  }

  return `la ${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km`;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
