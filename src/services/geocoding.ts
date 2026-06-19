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
    id: String(item.place_id),
    label: item.display_name,
    street: item.address?.road,
    number: item.address?.house_number,
    city: item.address?.city || item.address?.town || item.address?.village,
    county: item.address?.county || item.address?.state,
    lat: Number(item.lat),
    lng: Number(item.lon)
  }));
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
    ...coordinates
  };
}
