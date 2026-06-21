export type NavigationProvider = "google_maps" | "apple_maps" | "waze" | "osm";

type NavigationParams = {
  lat: number;
  lng: number;
  label?: string;
  provider?: NavigationProvider;
};

type NavigationUrlParams = NavigationParams & {
  provider: NavigationProvider;
};

export function detectDefaultNavigationProvider(): NavigationProvider {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod|macintosh/.test(userAgent)) {
    return "apple_maps";
  }

  if (/android/.test(userAgent)) {
    return "google_maps";
  }

  return "google_maps";
}

export function getNavigationUrl({ lat, lng, label, provider }: NavigationUrlParams) {
  const destination = `${lat},${lng}`;
  const encodedLabel = encodeURIComponent(label || "Destinație Rider");

  if (provider === "apple_maps") {
    return `http://maps.apple.com/?daddr=${destination}&q=${encodedLabel}`;
  }

  if (provider === "waze") {
    return `https://waze.com/ul?ll=${destination}&navigate=yes`;
  }

  if (provider === "osm") {
    return `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

export function openNavigationToCoordinates({ lat, lng, label, provider }: NavigationParams) {
  const targetProvider = provider || detectDefaultNavigationProvider();
  const url = getNavigationUrl({
    lat,
    lng,
    label,
    provider: targetProvider
  });
  const opened = window.open(url, "_blank", "noopener,noreferrer");

  if (!opened) {
    window.location.href = url;
  }
}
