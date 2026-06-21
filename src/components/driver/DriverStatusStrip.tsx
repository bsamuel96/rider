import { Clock, Navigation, Star } from "lucide-react";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { getDriverStatusLabel } from "@/services/driverWorkflow";
import type { DriverWorkflowStatus } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type DriverStatusStripProps = {
  status: DriverWorkflowStatus;
  todayEarnings: number;
  rating: number;
  online: boolean;
};

export function DriverStatusStrip({ status, todayEarnings, rating, online }: DriverStatusStripProps) {
  return (
    <MapFloatingPanel className="absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[540] flex min-h-[52px] items-center justify-between gap-3 px-3 py-2 md:left-5 md:right-auto md:w-[420px]">
      <div>
        <p className="text-xs font-semibold text-muted-foreground">Șofer</p>
        <p className="text-sm font-semibold">{getDriverStatusLabel(status)}</p>
      </div>
      <div className="flex items-center gap-2 text-[11px] font-semibold">
        <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-muted/70 px-2.5">
          <Navigation className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {online ? "GPS activ" : "Offline"}
        </span>
        <span className="hidden min-h-8 items-center gap-1 rounded-full bg-muted/70 px-2.5 sm:inline-flex">
          <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {formatCurrency(todayEarnings)}
        </span>
        <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-muted/70 px-2.5">
          <Star className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {rating.toFixed(2)}
        </span>
      </div>
    </MapFloatingPanel>
  );
}
