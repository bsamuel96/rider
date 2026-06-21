import { type LatLngExpression, type LatLngTuple } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import { MapActorMarker } from "@/components/maps/MapActorMarker";
import { useStreetRoute } from "@/hooks/useStreetRoute";
import type { Coordinates } from "@/types/domain";
import { DEFAULT_CENTER, TILE_URL } from "@/utils/constants";

type MobilityMapProps = {
  pickup?: Coordinates;
  destination?: Coordinates;
  driver?: Coordinates;
  fullscreen?: boolean;
};

function MapBounds({ points }: { points: LatLngTuple[] }) {
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

    map.fitBounds(points, {
      padding: [42, 42],
      maxZoom: 15
    });
  }, [map, points]);

  return null;
}

export function MobilityMap({ pickup, destination, driver, fullscreen = false }: MobilityMapProps) {
  const streetRoute = useStreetRoute({
    from: pickup,
    to: destination,
    enabled: Boolean(pickup && destination)
  });
  const route = streetRoute.routePoints.map((point) => [point.lat, point.lng] as LatLngTuple);
  const points = [pickup, destination, driver].filter(Boolean).map((point) => [point!.lat, point!.lng] as LatLngTuple);
  const bounds = route.length >= 2 ? [...points, ...route] : points;
  const center: LatLngExpression = pickup ? [pickup.lat, pickup.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
  const routeIsFallback = streetRoute.provider === "fallback";

  return (
    <div className={fullscreen ? "h-[calc(100vh-4rem)] overflow-hidden rounded-2xl" : "h-72 overflow-hidden rounded-2xl shadow-map-control"}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={TILE_URL}
        />
        <MapBounds points={bounds} />
        <MapActorMarker type="pickup" position={pickup} label="Pickup" />
        <MapActorMarker type="destination" position={destination} label="Destinație" />
        <MapActorMarker type="driver" position={driver} label="Șofer" etaLabel="~6 min" heading={25} />
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
      </MapContainer>
    </div>
  );
}
