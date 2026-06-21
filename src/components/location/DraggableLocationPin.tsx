import L from "leaflet";
import { useMemo } from "react";
import { Marker } from "react-leaflet";
import type { Coordinates } from "@/types/domain";

type DraggableLocationPinProps = {
  position: Coordinates;
  dragging: boolean;
  onDraggingChange: (dragging: boolean) => void;
  onChange: (position: Coordinates) => void;
};

export function DraggableLocationPin({
  position,
  dragging,
  onDraggingChange,
  onChange
}: DraggableLocationPinProps) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "location-pin-icon",
        html: `<div class="location-pin-label">${dragging ? "Eliberează pentru a selecta" : "Mută pinul"}</div><div class="location-pin-dot ${dragging ? "is-dragging" : ""}"></div>`,
        iconSize: [132, 78],
        iconAnchor: [66, 66]
      }),
    [dragging]
  );

  return (
    <Marker
      position={[position.lat, position.lng]}
      draggable
      icon={icon}
      eventHandlers={{
        dragstart: () => onDraggingChange(true),
        dragend: (event) => {
          const marker = event.target as L.Marker;
          const nextPosition = marker.getLatLng();
          onDraggingChange(false);
          onChange({
            lat: nextPosition.lat,
            lng: nextPosition.lng
          });
        }
      }}
    />
  );
}
