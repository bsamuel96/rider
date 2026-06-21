import { useCallback, useMemo, useState } from "react";
import type L from "leaflet";
import { focusMapOnCoordinates } from "@/hooks/useMapFocus";
import type { Coordinates } from "@/types/domain";

type UseCurrentLocationFocusArgs = {
  map?: L.Map | null;
  zoom?: number;
  onLocate?: (coordinates: Coordinates) => void;
};

export function useCurrentLocationFocus({ map, zoom = 16, onLocate }: UseCurrentLocationFocusArgs) {
  const geolocationAvailable = typeof navigator !== "undefined" && "geolocation" in navigator;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (!geolocationAvailable) {
      setMessage("Nu am putut detecta locația curentă.");
      return;
    }

    setLoading(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        focusMapOnCoordinates(map, coordinates, zoom);
        onLocate?.(coordinates);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setMessage(
          error.code === error.PERMISSION_DENIED
            ? "Permite accesul la locație pentru a centra harta."
            : "Nu am putut detecta locația curentă."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 5000
      }
    );
  }, [geolocationAvailable, map, onLocate, zoom]);

  return useMemo(
    () => ({
      geolocationAvailable,
      loading,
      message,
      locate,
      clearMessage: () => setMessage(null)
    }),
    [geolocationAvailable, loading, locate, message]
  );
}
