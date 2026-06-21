import { MapPin, Navigation, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { createCurrentLocationSuggestion } from "@/services/geocoding";
import type { AddressSuggestion } from "@/types/domain";
import { useAddressSearch } from "@/hooks/useAddressSearch";
import { cn } from "@/utils/cn";

type AddressSearchProps = {
  label: string;
  placeholder: string;
  value?: AddressSuggestion;
  currentLat?: number;
  currentLng?: number;
  onSelect: (address: AddressSuggestion) => void;
};

export function AddressSearch({ label, placeholder, value, currentLat, currentLng, onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState(value?.label || "");
  const deferredQuery = useDeferredValue(query);
  const { data = [], isFetching, isError } = useAddressSearch(deferredQuery);

  useEffect(() => {
    setQuery(value?.label || "");
  }, [value?.label]);

  const suggestions = useMemo(() => {
    const current = createCurrentLocationSuggestion(currentLat, currentLng);

    if (label.toLowerCase().includes("pickup")) {
      return [current, ...data];
    }

    return data;
  }, [currentLat, currentLng, data, label]);

  const handleSelect = (address: AddressSuggestion) => {
    setQuery(address.label);
    onSelect(address);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="bg-background/70 pl-9 pr-10"
          placeholder={placeholder}
          autoComplete="street-address"
        />
        {query && (
          <button
            type="button"
            aria-label="Șterge adresa"
            onClick={() => setQuery("")}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className={cn("space-y-2", !query && "hidden")}>
        {isFetching && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {isError && <p className="text-sm text-destructive">Căutarea adresei nu este disponibilă momentan.</p>}

        {!isFetching && deferredQuery.trim().length >= 3 && suggestions.length === 0 && !isError && (
          <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">Nu am găsit rezultate pentru această adresă.</p>
        )}

        {!isFetching &&
          suggestions.slice(0, 5).map((address) => (
            <button
              type="button"
              key={address.id}
              onClick={() => handleSelect(address)}
              className="flex w-full items-start gap-3 rounded-xl border border-border/60 bg-background/70 p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
                {address.id === "current-location" ? (
                  <Navigation className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </span>
              <span className="min-w-0">
                <span className="line-clamp-1 block text-sm font-semibold">{address.street || address.label}</span>
                <span className="line-clamp-2 block text-xs text-muted-foreground">
                  {[address.number, address.city, address.county].filter(Boolean).join(", ") || address.label}
                </span>
              </span>
            </button>
          ))}
      </div>
    </div>
  );
}
