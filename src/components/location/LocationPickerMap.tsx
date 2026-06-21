import type L from "leaflet";
import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import { DraggableLocationPin } from "@/components/location/DraggableLocationPin";
import { LocateMeButton } from "@/components/maps/LocateMeButton";
import { useMapClickLocation } from "@/hooks/useMapClickLocation";
import type { Coordinates } from "@/types/domain";
import { TILE_URL } from "@/utils/constants";

type LocationPickerMapProps = {
  pin: Coordinates;
  currentLocation?: Coordinates;
  onPinChange: (pin: Coordinates) => void;
};

export function LocationPickerMap({ pin, currentLocation, onPinChange }: LocationPickerMapProps) {
  const [dragging, setDragging] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  return (
    <>
      <MapContainer center={[pin.lat, pin.lng]} zoom={15} scrollWheelZoom className="absolute inset-0 z-0 h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={TILE_URL}
        />
        <MapInstanceBridge onReady={setMap} />
        <MapClickHandler onPinChange={onPinChange} />
        <MapCenter pin={pin} dragging={dragging} />
        {currentLocation && (
          <CircleMarker
            center={[currentLocation.lat, currentLocation.lng]}
            radius={8}
            pathOptions={{
              color: "#14b8a6",
              fillColor: "#14b8a6",
              fillOpacity: 0.75,
              weight: 3
            }}
          />
        )}
        <DraggableLocationPin
          position={pin}
          dragging={dragging}
          onDraggingChange={setDragging}
          onChange={onPinChange}
        />
      </MapContainer>
      <LocateMeButton
        map={map}
        onLocate={onPinChange}
        className="absolute right-3 top-[calc(env(safe-area-inset-top)+8.75rem)] z-[650]"
      />
    </>
  );
}

function MapInstanceBridge({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

function MapClickHandler({ onPinChange }: { onPinChange: (pin: Coordinates) => void }) {
  useMapClickLocation({ onSelect: onPinChange });
  return null;
}

function MapCenter({ pin, dragging }: { pin: Coordinates; dragging: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!dragging) {
      map.panTo([pin.lat, pin.lng], {
        animate: true,
        duration: 0.25
      });
    }
  }, [dragging, map, pin.lat, pin.lng]);

  return null;
}
