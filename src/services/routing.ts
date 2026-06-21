import type { Coordinates } from "@/types/domain";
import { estimateEtaMinutes, haversineDistanceKm } from "@/utils/geo";

export type RoutePoint = {
  lat: number;
  lng: number;
};

export type RouteResult = {
  geometry: RoutePoint[];
  distanceKm: number;
  durationMinutes: number;
  provider: "osrm" | "fallback";
};

type RouteProfile = "driving" | "walking" | "cycling";

type OsrmRouteResponse = {
  routes?: Array<{
    distance?: number;
    duration?: number;
    geometry?: {
      coordinates?: Array<[number, number]>;
    };
  }>;
};

const routeCache = new Map<string, RouteResult>();

export async function fetchStreetRoute(params: {
  from: Coordinates;
  to: Coordinates;
  profile?: RouteProfile;
  signal?: AbortSignal;
}): Promise<RouteResult> {
  const profile = params.profile || getDefaultProfile();
  const cacheKey = getRouteCacheKey(params.from, params.to, profile);
  const cachedRoute = routeCache.get(cacheKey);

  if (cachedRoute) {
    return cachedRoute;
  }

  if (import.meta.env.VITE_ROUTING_PROVIDER && import.meta.env.VITE_ROUTING_PROVIDER !== "osrm") {
    return cacheRoute(cacheKey, createFallbackRoute(params.from, params.to));
  }

  try {
    const route = await fetchOsrmRoute({
      from: params.from,
      to: params.to,
      profile,
      signal: params.signal
    });

    return cacheRoute(cacheKey, route);
  } catch (error) {
    if (params.signal?.aborted || isAbortError(error)) {
      throw error;
    }

    return cacheRoute(cacheKey, createFallbackRoute(params.from, params.to));
  }
}

function getDefaultProfile(): RouteProfile {
  const configuredProfile = import.meta.env.VITE_OSRM_PROFILE;

  if (configuredProfile === "walking" || configuredProfile === "cycling" || configuredProfile === "driving") {
    return configuredProfile;
  }

  return "driving";
}

async function fetchOsrmRoute(params: {
  from: Coordinates;
  to: Coordinates;
  profile: RouteProfile;
  signal?: AbortSignal;
}): Promise<RouteResult> {
  const baseUrl = (import.meta.env.VITE_OSRM_ROUTE_URL || "https://router.project-osrm.org").replace(/\/$/, "");
  const routePath = `${params.from.lng},${params.from.lat};${params.to.lng},${params.to.lat}`;
  const url = `${baseUrl}/route/v1/${params.profile}/${routePath}?overview=full&geometries=geojson&steps=false`;
  const response = await fetch(url, { signal: params.signal });

  if (!response.ok) {
    throw new Error(`OSRM route request failed with ${response.status}`);
  }

  const data = (await response.json()) as OsrmRouteResponse;
  const route = data.routes?.[0];
  const coordinates = route?.geometry?.coordinates;

  if (!coordinates?.length || route?.distance === undefined || route.duration === undefined) {
    throw new Error("OSRM route response did not include route geometry");
  }

  return {
    geometry: coordinates.map(([lng, lat]) => ({ lat, lng })),
    distanceKm: route.distance / 1000,
    durationMinutes: Math.max(1, Math.ceil(route.duration / 60)),
    provider: "osrm"
  };
}

function createFallbackRoute(from: Coordinates, to: Coordinates): RouteResult {
  const distanceKm = haversineDistanceKm(from, to);

  return {
    geometry: [from, to],
    distanceKm,
    durationMinutes: estimateEtaMinutes(distanceKm, "active_ride"),
    provider: "fallback"
  };
}

function cacheRoute(cacheKey: string, route: RouteResult) {
  routeCache.set(cacheKey, route);
  return route;
}

function getRouteCacheKey(from: Coordinates, to: Coordinates, profile: RouteProfile) {
  return [
    profile,
    from.lat.toFixed(5),
    from.lng.toFixed(5),
    to.lat.toFixed(5),
    to.lng.toFixed(5)
  ].join(":");
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
