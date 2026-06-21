import type { AddressSuggestion } from "@/types/domain";
import { DEFAULT_CENTER, NOMINATIM_URL } from "@/utils/constants";

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
  };
};

type NominatimReverseResult = {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: NominatimResult["address"];
};

function mapNominatimAddress(item: NominatimResult | NominatimReverseResult, fallbackLat?: number, fallbackLng?: number): AddressSuggestion {
  return {
    id: item.place_id ? String(item.place_id) : `map-pin-${fallbackLat ?? item.lat}-${fallbackLng ?? item.lon}`,
    label: item.display_name || "Locație selectată pe hartă",
    street: item.address?.road,
    number: item.address?.house_number,
    city: item.address?.city || item.address?.town || item.address?.village,
    county: item.address?.county || item.address?.state,
    lat: Number(item.lat ?? fallbackLat ?? DEFAULT_CENTER.lat),
    lng: Number(item.lon ?? fallbackLng ?? DEFAULT_CENTER.lng),
    rawAddress: item
  };
}

export async function searchAddresses(query: string, signal?: AbortSignal): Promise<AddressSuggestion[]> {
  if (query.trim().length < 3) {
    return [];
  }

  const url = new URL(`${NOMINATIM_URL}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "ro");

  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Nu am putut căuta adresa.");
  }

  const data = (await response.json()) as NominatimResult[];

  return data.map((item) => ({
    ...mapNominatimAddress(item),
    source: "search"
  }));
}

export async function reverseGeocode({
  lat,
  lng,
  signal
}: {
  lat: number;
  lng: number;
  signal?: AbortSignal;
}): Promise<AddressSuggestion> {
  const url = new URL(`${NOMINATIM_URL}/reverse`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Nu am putut detecta adresa.");
  }

  const data = (await response.json()) as NominatimReverseResult;

  return {
    ...mapNominatimAddress(data, lat, lng),
    id: data.place_id ? String(data.place_id) : `map-pin-${lat.toFixed(6)}-${lng.toFixed(6)}`,
    lat,
    lng,
    source: "map_pin"
  };
}

export function createCurrentLocationSuggestion(lat?: number, lng?: number): AddressSuggestion {
  const coordinates = {
    lat: lat ?? DEFAULT_CENTER.lat,
    lng: lng ?? DEFAULT_CENTER.lng
  };

  return {
    id: "current-location",
    label: "Locația mea curentă",
    street: "Poziție GPS",
    city: "București",
    county: "București",
    source: "current_location",
    ...coordinates
  };
}

export function createMapPinFallbackSuggestion(lat: number, lng: number): AddressSuggestion {
  return {
    id: `map-pin-${lat.toFixed(6)}-${lng.toFixed(6)}`,
    label: "Locație selectată pe hartă",
    street: "Pin pe hartă",
    lat,
    lng,
    source: "map_pin"
  };
}
