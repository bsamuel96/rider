import { CheckCircle2, LocateFixed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AddressSuggestion, Coordinates } from "@/types/domain";

type LocationConfirmPanelProps = {
  address: AddressSuggestion;
  coordinates: Coordinates;
  loading: boolean;
  error: string | null;
  onUseCurrentLocation: () => void;
  onConfirm: () => void;
};

export function LocationConfirmPanel({
  address,
  coordinates,
  loading,
  error,
  onUseCurrentLocation,
  onConfirm
}: LocationConfirmPanelProps) {
  return (
    <section className="absolute inset-x-3 bottom-[var(--floating-bottom-offset)] z-[620] rounded-3xl border border-border/60 bg-background/90 p-4 shadow-floating backdrop-blur-2xl md:bottom-5 md:left-1/2 md:right-auto md:w-[440px] md:-translate-x-1/2">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {loading ? "Detectăm adresa..." : "Locație selectată"}
          </p>
          <h2 className="mt-1 line-clamp-2 text-sm font-semibold">{address.label}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Lat {coordinates.lat.toFixed(6)}, Lng {coordinates.lng.toFixed(6)}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-2xl bg-amber-500/12 p-3 text-xs font-medium text-amber-700 dark:text-amber-300">
          Nu am putut detecta adresa, dar poți confirma coordonatele.
        </p>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1.35fr]">
        <Button type="button" variant="outline" onClick={onUseCurrentLocation}>
          <LocateFixed className="h-4 w-4" aria-hidden="true" />
          Folosește locația curentă
        </Button>
        <Button type="button" onClick={onConfirm}>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Confirmă locația
        </Button>
      </div>
    </section>
  );
}
