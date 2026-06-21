import { useEffect, useMemo, useState } from "react";
import { createMapPinFallbackSuggestion, reverseGeocode } from "@/services/geocoding";
import type { AddressSuggestion, Coordinates } from "@/types/domain";

type ReverseGeocodeState = {
  address: AddressSuggestion;
  loading: boolean;
  error: string | null;
};

export function useReverseGeocode(position: Coordinates, debounceMs = 450): ReverseGeocodeState {
  const fallback = useMemo(
    () => createMapPinFallbackSuggestion(position.lat, position.lng),
    [position.lat, position.lng]
  );
  const [state, setState] = useState<ReverseGeocodeState>({
    address: fallback,
    loading: false,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setState((current) => ({
        ...current,
        address: fallback,
        loading: true,
        error: null
      }));

      reverseGeocode({
        lat: position.lat,
        lng: position.lng,
        signal: controller.signal
      })
        .then((address) => {
          setState({
            address: {
              ...address,
              source: "map_pin"
            },
            loading: false,
            error: null
          });
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) {
            return;
          }

          setState({
            address: fallback,
            loading: false,
            error: error instanceof Error ? error.message : "Nu am putut detecta adresa, dar poți confirma coordonatele."
          });
        });
    }, debounceMs);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [debounceMs, fallback, position.lat, position.lng]);

  return state;
}
