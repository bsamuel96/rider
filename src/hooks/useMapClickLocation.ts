import { useRef } from "react";
import { useMapEvents } from "react-leaflet";
import type { Coordinates } from "@/types/domain";

type UseMapClickLocationArgs = {
  onSelect: (coordinates: Coordinates) => void;
};

export function useMapClickLocation({ onSelect }: UseMapClickLocationArgs) {
  const longPressTimer = useRef<number | undefined>();

  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    },
    mousedown(event) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = window.setTimeout(() => {
        onSelect({
          lat: event.latlng.lat,
          lng: event.latlng.lng
        });
      }, 520);
    },
    mouseup() {
      window.clearTimeout(longPressTimer.current);
    },
    dragstart() {
      window.clearTimeout(longPressTimer.current);
    }
  });
}
