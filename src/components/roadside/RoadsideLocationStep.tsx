import { MapPin, MapPinned, Navigation } from "lucide-react";
import { useState } from "react";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { Button } from "@/components/ui/button";
import type { AddressSuggestion } from "@/types/domain";

type RoadsideLocationStepProps = {
  currentAddress: AddressSuggestion;
  onUseCurrentLocation: () => void;
  onAddressSelect: (address: AddressSuggestion) => void;
  onPickOnMap: () => void;
  onNext: () => void;
};

export function RoadsideLocationStep({
  currentAddress,
  onUseCurrentLocation,
  onAddressSelect,
  onPickOnMap,
  onNext
}: RoadsideLocationStepProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold">Confirmă locația</p>
        <p className="mt-1 text-xs text-muted-foreground">Operatorul va primi poziția de pornire a intervenției.</p>
      </div>
      <div className="glass-panel flex items-start gap-3 p-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{currentAddress.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lat {currentAddress.lat.toFixed(5)}, Lng {currentAddress.lng.toFixed(5)}
            {currentAddress.source === "map_pin" ? " · Pin pe hartă" : ""}
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" variant="outline" onClick={onUseCurrentLocation}>
          <Navigation className="h-4 w-4" />
          Folosește locația mea
        </Button>
        <Button type="button" variant="outline" onClick={onPickOnMap} aria-label="Alege locația roadside pe hartă">
          <MapPinned className="h-4 w-4" />
          Alege pe hartă
        </Button>
        <Button type="button" variant="outline" onClick={() => setEditing((value) => !value)}>
          Schimbă adresa
        </Button>
      </div>
      {editing && (
        <AddressSearch
          label="Adresă curentă"
          placeholder="Caută adresa vehiculului"
          currentLat={currentAddress.lat}
          currentLng={currentAddress.lng}
          value={currentAddress}
          onPickOnMap={onPickOnMap}
          onSelect={(address) => {
            onAddressSelect(address);
            setEditing(false);
          }}
        />
      )}
      <div>
        <Button type="button" onClick={onNext}>
          Continuă
        </Button>
      </div>
    </div>
  );
}
