import type { Coordinates } from "@/types/domain";
import {
  getNavigationUrl,
  type NavigationProvider,
  openNavigationToCoordinates
} from "@/services/navigation";

type NavigationProviderSheetProps = {
  open: boolean;
  coordinates?: Coordinates;
  label?: string;
  onClose: () => void;
};

const providers: Array<{ id: NavigationProvider; label: string }> = [
  { id: "google_maps", label: "Google Maps" },
  { id: "apple_maps", label: "Apple Maps" },
  { id: "waze", label: "Waze" },
  { id: "osm", label: "OpenStreetMap" }
];

export function NavigationProviderSheet({ open, coordinates, label, onClose }: NavigationProviderSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[720] grid place-items-end bg-background/35 p-3 backdrop-blur-sm md:place-items-center">
      <section className="w-full max-w-sm rounded-3xl border border-border/60 bg-background/95 p-4 shadow-floating">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Alege navigația</h2>
            <p className="mt-1 text-sm text-muted-foreground">Deschide ruta în aplicația preferată.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted/70 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Închide alegerea navigației"
          >
            X
          </button>
        </div>

        <div className="grid gap-2">
          {providers.map((provider) => {
            const disabled = !coordinates;
            const href = coordinates
              ? getNavigationUrl({
                  lat: coordinates.lat,
                  lng: coordinates.lng,
                  label,
                  provider: provider.id
                })
              : "#";

            return (
              <a
                key={provider.id}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-disabled={disabled}
                onClick={(event) => {
                  if (disabled) {
                    event.preventDefault();
                    return;
                  }

                  event.preventDefault();
                  openNavigationToCoordinates({
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                    label,
                    provider: provider.id
                  });
                  onClose();
                }}
                className="inline-flex min-h-12 items-center justify-between rounded-2xl bg-muted/60 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50"
              >
                {provider.label}
                <span aria-hidden="true">&gt;</span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
