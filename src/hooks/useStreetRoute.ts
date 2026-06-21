import { useEffect, useMemo, useState } from "react";
import { fetchStreetRoute } from "@/services/routing";
import type { Coordinates, RouteProvider } from "@/types/domain";
import { estimateEtaMinutes, haversineDistanceKm } from "@/utils/geo";

type UseStreetRouteParams = {
  from?: Coordinates;
  to?: Coordinates;
  enabled?: boolean;
};

type UseStreetRouteResult = {
  routePoints: Coordinates[];
  distanceKm?: number;
  durationMinutes?: number;
  loading: boolean;
  error?: string;
  provider: RouteProvider;
};

const routeDebounceMs = 250;

export function useStreetRoute({ from, to, enabled = true }: UseStreetRouteParams): UseStreetRouteResult {
  const fallbackRoute = useMemo(() => {
    if (!from || !to || !enabled) {
      return undefined;
    }

    const distanceKm = haversineDistanceKm(from, to);

    return {
      routePoints: [from, to],
      distanceKm,
      durationMinutes: estimateEtaMinutes(distanceKm, "active_ride"),
      provider: "fallback" as RouteProvider
    };
  }, [enabled, from, to]);

  const [route, setRoute] = useState<UseStreetRouteResult>({
    routePoints: [],
    loading: false,
    provider: "none"
  });

  useEffect(() => {
    if (!from || !to || !enabled) {
      setRoute({
        routePoints: [],
        loading: false,
        provider: "none"
      });
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setRoute({
        routePoints: fallbackRoute?.routePoints || [from, to],
        distanceKm: fallbackRoute?.distanceKm,
        durationMinutes: fallbackRoute?.durationMinutes,
        loading: true,
        provider: "fallback"
      });

      fetchStreetRoute({
        from,
        to,
        signal: controller.signal
      })
        .then((result) => {
          if (controller.signal.aborted) {
            return;
          }

          setRoute({
            routePoints: result.geometry,
            distanceKm: result.distanceKm,
            durationMinutes: result.durationMinutes,
            loading: false,
            provider: result.provider
          });
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) {
            return;
          }

          setRoute({
            routePoints: fallbackRoute?.routePoints || [from, to],
            distanceKm: fallbackRoute?.distanceKm,
            durationMinutes: fallbackRoute?.durationMinutes,
            loading: false,
            error: error instanceof Error ? error.message : "Ruta stradală nu a putut fi calculată.",
            provider: "fallback"
          });
        });
    }, routeDebounceMs);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [enabled, fallbackRoute, from, to]);

  return route;
}
