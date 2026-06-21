import { Clock3, Route } from "lucide-react";
import { formatDistanceKm, formatEta } from "@/utils/geo";

type MapEtaChipProps = {
  label: string;
  minutes?: number;
  distanceKm?: number;
};

export function MapEtaChip({ label, minutes, distanceKm }: MapEtaChipProps) {
  return (
    <span className="glass-chip map-layer-control inline-flex min-h-10 items-center gap-2 px-3 py-2 text-xs font-semibold">
      <Clock3 className="h-3.5 w-3.5 text-primary" />
      <span>{label}</span>
      <span className="text-muted-foreground">{formatEta(minutes)}</span>
      {distanceKm !== undefined && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Route className="h-3 w-3" />
          {formatDistanceKm(distanceKm)}
        </span>
      )}
    </span>
  );
}
