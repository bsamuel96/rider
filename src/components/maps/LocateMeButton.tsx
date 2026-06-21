import type L from "leaflet";
import { Loader2, LocateFixed } from "lucide-react";
import { MapFloatingButton } from "@/components/maps/MapFloatingButton";
import { useCurrentLocationFocus } from "@/hooks/useCurrentLocationFocus";
import type { Coordinates } from "@/types/domain";
import { cn } from "@/utils/cn";

type LocateMeButtonProps = {
  map?: L.Map | null;
  onLocate?: (coordinates: Coordinates) => void;
  updatePickup?: boolean;
  zoom?: number;
  className?: string;
};

export function LocateMeButton({ map, onLocate, zoom = 16, className }: LocateMeButtonProps) {
  const { geolocationAvailable, loading, message, locate } = useCurrentLocationFocus({
    map,
    zoom,
    onLocate
  });

  return (
    <div className={cn("relative", className)}>
      <MapFloatingButton
        aria-label="Localizează-mă"
        title="Localizează-mă"
        onClick={locate}
        disabled={!geolocationAvailable || loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LocateFixed className="h-4 w-4" aria-hidden="true" />}
      </MapFloatingButton>
      {message && (
        <p className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-2xl bg-background/92 p-3 text-xs font-medium text-foreground shadow-floating backdrop-blur-xl">
          {message}
        </p>
      )}
    </div>
  );
}
