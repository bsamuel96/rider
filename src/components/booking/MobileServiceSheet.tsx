import { Route } from "lucide-react";
import { MapServiceDock } from "@/components/maps/MapServiceDock";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import type { ServiceType } from "@/types/domain";
import { formatDistance } from "@/utils/format";

type MobileServiceSheetProps = {
  serviceType: ServiceType;
  distanceKm?: number;
  etaMinutes?: number;
  onServiceChange: (serviceType: ServiceType) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function MobileServiceSheet({
  serviceType,
  distanceKm,
  etaMinutes,
  onServiceChange,
  onBack,
  onContinue
}: MobileServiceSheetProps) {
  return (
    <MobileBottomSheet size="medium" className="max-h-[32svh]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/55 p-3">
          <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
            <Route className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{formatDistance(distanceKm)}</span>
          </span>
          <span className="text-xs text-muted-foreground">{etaMinutes ? `~${etaMinutes} min` : "ETA în calcul"}</span>
        </div>
        <MapServiceDock compact value={serviceType} onChange={onServiceChange} />
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <button
            type="button"
            onClick={onBack}
            className="min-h-11 rounded-xl border border-border/60 bg-background/55 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Înapoi
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Continuă
          </button>
        </div>
      </div>
    </MobileBottomSheet>
  );
}
