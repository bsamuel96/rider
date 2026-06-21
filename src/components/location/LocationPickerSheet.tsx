import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { LocationConfirmPanel } from "@/components/location/LocationConfirmPanel";
import { LocationPickerMap } from "@/components/location/LocationPickerMap";
import { LocationSearchOrPinTabs } from "@/components/location/LocationSearchOrPinTabs";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { createCurrentLocationSuggestion } from "@/services/geocoding";
import type { AddressSuggestion, Coordinates } from "@/types/domain";

type LocationPickerMode = "search" | "map";

type LocationPickerSheetProps = {
  open: boolean;
  title?: string;
  initialLocation?: AddressSuggestion;
  onClose: () => void;
  onConfirm: (location: AddressSuggestion) => void;
};

function coordinatesMatch(a: Coordinates, b: Coordinates) {
  return Math.abs(a.lat - b.lat) < 0.000001 && Math.abs(a.lng - b.lng) < 0.000001;
}

export function LocationPickerSheet({
  open,
  title = "Alege locația",
  initialLocation,
  onClose,
  onConfirm
}: LocationPickerSheetProps) {
  const { position } = useGeolocation();
  const [mode, setMode] = useState<LocationPickerMode>("map");
  const [pin, setPin] = useState<Coordinates>(() => initialLocation || position);
  const [selectedOverride, setSelectedOverride] = useState<AddressSuggestion | undefined>(initialLocation);
  const currentLocation = useMemo(
    () => createCurrentLocationSuggestion(position.lat, position.lng),
    [position.lat, position.lng]
  );
  const reverse = useReverseGeocode(pin);
  const displayAddress =
    selectedOverride && coordinatesMatch(selectedOverride, pin)
      ? selectedOverride
      : reverse.address;

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextPin = initialLocation || position;
    setPin(nextPin);
    setSelectedOverride(initialLocation);
    setMode("map");
  }, [initialLocation, open, position]);

  if (!open) {
    return null;
  }

  const updatePin = (coordinates: Coordinates) => {
    setSelectedOverride(undefined);
    setPin(coordinates);
    setMode("map");
  };

  const useCurrentLocation = () => {
    setPin(currentLocation);
    setSelectedOverride(currentLocation);
    setMode("map");
  };

  const confirmLocation = () => {
    onConfirm({
      ...displayAddress,
      lat: pin.lat,
      lng: pin.lng,
      source: displayAddress.source || "map_pin"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[760] bg-background">
      <LocationPickerMap pin={pin} currentLocation={position} onPinChange={updatePin} />

      <div className="pointer-events-none absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[640] space-y-3 md:left-1/2 md:right-auto md:w-[440px] md:-translate-x-1/2">
        <div className="glass-panel pointer-events-auto flex min-h-[52px] items-center gap-3 rounded-3xl px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Înapoi"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="truncate text-xs text-muted-foreground">Mută pinul pe locația exactă</p>
          </div>
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="glass-panel pointer-events-auto rounded-3xl p-2">
          <LocationSearchOrPinTabs value={mode} onChange={setMode} />
          {mode === "search" && (
            <div className="mt-3">
              <AddressSearch
                label="Caută adresă"
                placeholder="Scrie strada sau locul"
                currentLat={position.lat}
                currentLng={position.lng}
                value={selectedOverride}
                onSelect={(address) => {
                  setSelectedOverride(address);
                  setPin({
                    lat: address.lat,
                    lng: address.lng
                  });
                  setMode("map");
                }}
              />
            </div>
          )}
        </div>
      </div>

      <LocationConfirmPanel
        address={displayAddress}
        coordinates={pin}
        loading={reverse.loading && !selectedOverride}
        error={reverse.error}
        onUseCurrentLocation={useCurrentLocation}
        onConfirm={confirmLocation}
      />
    </div>
  );
}
