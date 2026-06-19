import { Clock3, Route } from "lucide-react";
import { formatDistanceKm, formatEta } from "@/utils/geo";

type MapEtaChipProps = {
  label: string;
  minutes?: number;
  distanceKm?: number;
};

export function MapEtaChip({ label, minutes, distanceKm }: MapEtaChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/85 px-3 py-2 text-xs font-semibold shadow-map-control backdrop-blur-xl">
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
