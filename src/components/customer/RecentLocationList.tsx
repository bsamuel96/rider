import { Clock3, MapPin } from "lucide-react";
import type { RecentLocation } from "@/types/domain";

type RecentLocationListProps = {
  locations: RecentLocation[];
  onSelect: (location: RecentLocation) => void;
};

export function RecentLocationList({ locations, onSelect }: RecentLocationListProps) {
  return (
    <section className="min-h-0 space-y-2 overflow-y-auto pb-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recente</h2>
        <span className="text-xs text-muted-foreground">Ultimele 4</span>
      </div>
      <div className="grid gap-2">
        {locations.slice(0, 4).map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => onSelect(location)}
            className="glass-panel flex min-h-14 items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{location.label}</span>
              <span className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {location.address}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
