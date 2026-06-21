import type L from "leaflet";
import type { Coordinates } from "@/types/domain";

export function focusMapOnCoordinates(map: L.Map | null | undefined, coordinates: Coordinates, zoom = 16) {
  if (!map) {
    return;
  }

  map.flyTo([coordinates.lat, coordinates.lng], zoom, {
    animate: true,
    duration: 0.65
  });
}
