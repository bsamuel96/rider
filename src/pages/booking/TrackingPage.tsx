import { useEffect, useMemo, useState } from "react";
import { CarFront, Clock } from "lucide-react";
import { MobilityMap } from "@/components/maps/MobilityMap";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import type { BookingStatus, Coordinates } from "@/types/domain";
import { STATUS_LABELS } from "@/utils/constants";

const statuses: BookingStatus[] = ["searching", "confirmed", "driver_en_route", "arrived", "in_progress", "completed"];

export function TrackingPage() {
  const draft = useAppStore((state) => state.bookingDraft);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusIndex((current) => Math.min(statuses.length - 1, current + 1));
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  const driver = useMemo<Coordinates | undefined>(() => {
    if (!draft.pickup) {
      return undefined;
    }

    const offset = Math.max(0.004, 0.018 - statusIndex * 0.003);
    return {
      lat: draft.pickup.lat + offset,
      lng: draft.pickup.lng - offset
    };
  }, [draft.pickup, statusIndex]);

  const currentStatus = statuses[statusIndex];

  return (
    <div className="relative mx-auto max-w-6xl">
      <MobilityMap pickup={draft.pickup} destination={draft.destination} driver={driver} fullscreen />

      <Card className="absolute inset-x-3 bottom-3 z-[500] p-4 md:inset-x-auto md:left-5 md:w-96">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge>{STATUS_LABELS[currentStatus]}</Badge>
            <h1 className="mt-3 text-lg font-semibold">Tracking în timp real</h1>
            <p className="mt-1 text-sm text-muted-foreground">Poziția șoferului și ETA se actualizează live.</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-secondary">
            <CarFront className="h-6 w-6" />
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted p-3 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          ETA {Math.max(1, 8 - statusIndex)} min
        </div>
      </Card>
    </div>
  );
}
