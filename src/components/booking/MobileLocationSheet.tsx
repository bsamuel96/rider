import { MapPin, Navigation } from "lucide-react";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import type { AddressSuggestion } from "@/types/domain";

type MobileLocationSheetProps = {
  pickup?: AddressSuggestion;
  destination?: AddressSuggestion;
  currentLat: number;
  currentLng: number;
  onDestinationSelect: (destination: AddressSuggestion) => void;
  onContinue: () => void;
};

export function MobileLocationSheet({
  pickup,
  destination,
  currentLat,
  currentLng,
  onDestinationSelect,
  onContinue
}: MobileLocationSheetProps) {
  return (
    <MobileBottomSheet size="large" className="max-h-[42svh]">
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-2xl bg-muted/55 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
            <Navigation className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{pickup?.label || "Locația mea curentă"}</p>
            <p className="text-xs text-muted-foreground">Pickup</p>
          </div>
        </div>
        <AddressSearch
          label="Destinație"
          placeholder="Unde mergi?"
          currentLat={currentLat}
          currentLng={currentLng}
          value={destination}
          onSelect={onDestinationSelect}
        />
        {destination ? (
          <button
            type="button"
            onClick={onContinue}
            className="min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Continuă
          </button>
        ) : (
          <p className="flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Alege destinația pentru a continua
          </p>
        )}
      </div>
    </MobileBottomSheet>
  );
}
