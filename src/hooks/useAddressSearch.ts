import { useQuery } from "@tanstack/react-query";
import { searchAddresses } from "@/services/geocoding";

export function useAddressSearch(query: string) {
  return useQuery({
    queryKey: ["address-search", query],
    queryFn: ({ signal }) => searchAddresses(query, signal),
    enabled: query.trim().length >= 3,
    staleTime: 1000 * 60 * 20,
    gcTime: 1000 * 60 * 60
  });
}
