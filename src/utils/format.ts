import type { Coordinates } from "@/types/domain";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDistance(value?: number) {
  if (!value) {
    return "0 km";
  }

  return `${value.toFixed(value > 10 ? 0 : 1)} km`;
}

export function haversineDistanceKm(start: Coordinates, end: Coordinates) {
  const radius = 6371;
  const dLat = toRadians(end.lat - start.lat);
  const dLng = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
