import { MapContainer, TileLayer } from "react-leaflet";
import { MapActorMarker } from "@/components/maps/MapActorMarker";
import type { Coordinates } from "@/types/domain";
import { TILE_URL } from "@/utils/constants";

type CurrentLocationMapWidgetProps = {
  position: Coordinates;
  onUseCurrentLocation: () => void;
};

export function CurrentLocationMapWidget({ position, onUseCurrentLocation }: CurrentLocationMapWidgetProps) {
  return (
    <section className="glass-panel relative min-h-[150px] overflow-hidden p-0">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={14}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full min-h-[150px] w-full"
      >
        <TileLayer url={TILE_URL} />
        <MapActorMarker type="user" position={position} label="Tu" pulse />
      </MapContainer>
      <div className="pointer-events-none absolute inset-x-3 bottom-3">
        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="glass-chip pointer-events-auto min-h-11 w-full px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Folosește locația curentă
        </button>
      </div>
    </section>
  );
}
