import { Layers, LocateFixed, Menu, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { MapFloatingButton } from "@/components/maps/MapFloatingButton";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import type { DriverWorkflowStatus } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type DriverHomeMapControlsProps = {
  status: DriverWorkflowStatus;
  todayEarnings: number;
  onMenu: () => void;
  onSafety: () => void;
  onLocate: () => void;
  onLayers: () => void;
  onPreferences: () => void;
};

export function DriverHomeMapControls({
  status,
  todayEarnings,
  onMenu,
  onSafety,
  onLocate,
  onLayers,
  onPreferences
}: DriverHomeMapControlsProps) {
  const online = status !== "offline" && status !== "preflight";

  return (
    <>
      <div className="pointer-events-none absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[550] grid grid-cols-[auto_1fr_auto] items-start gap-3 md:inset-x-5">
        <MapFloatingButton aria-label="Deschide meniul șofer" title="Meniu" onClick={onMenu} className="pointer-events-auto">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </MapFloatingButton>

        <MapFloatingPanel className="pointer-events-auto mx-auto min-w-[126px] px-4 py-2 text-center">
          <p className="text-base font-semibold leading-none">{formatCurrency(todayEarnings)}</p>
          <p className="mt-1 text-[11px] font-semibold text-muted-foreground">Astăzi</p>
        </MapFloatingPanel>

        <MapFloatingButton aria-label="Deschide centrul de siguranță" title="Siguranță" onClick={onSafety} className="pointer-events-auto">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </MapFloatingButton>
      </div>

      <div className="pointer-events-auto absolute right-3 top-[calc(env(safe-area-inset-top)+4.75rem)] z-[550] flex flex-col gap-2 md:right-5">
        <MapFloatingButton aria-label="Centrează pe poziția curentă" title="Localizează-mă" onClick={onLocate}>
          <LocateFixed className="h-4 w-4" aria-hidden="true" />
        </MapFloatingButton>
        <MapFloatingButton aria-label="Straturi hartă" title="Straturi hartă" onClick={onLayers}>
          <Layers className="h-4 w-4" aria-hidden="true" />
        </MapFloatingButton>
        <MapFloatingButton aria-label="Preferințe curse" title="Preferințe curse" onClick={onPreferences}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </MapFloatingButton>
        <span className="rounded-full border border-border/60 bg-background/85 px-3 py-2 text-center text-[11px] font-semibold shadow-map-control backdrop-blur-xl">
          {online ? "Online" : "Offline"}
        </span>
      </div>
    </>
  );
}
