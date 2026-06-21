import type { LucideIcon } from "lucide-react";
import { CarFront, CircleDot, MapPin, Truck, UserRound, Wrench } from "lucide-react";
import { cn } from "@/utils/cn";

type ActorLegendType = "user" | "driver" | "roadside" | "pickup" | "destination" | "tow";

type ActorLegendItem = {
  type: ActorLegendType;
  label: string;
};

type MapActorLegendProps = {
  items: ActorLegendItem[];
  className?: string;
};

const legendIcons: Record<ActorLegendType, LucideIcon> = {
  user: UserRound,
  driver: CarFront,
  roadside: Wrench,
  pickup: CircleDot,
  destination: MapPin,
  tow: Truck
};

export function MapActorLegend({ items, className }: MapActorLegendProps) {
  return (
    <div className={cn("glass-chip map-layer-control inline-flex min-h-10 flex-wrap items-center gap-2 px-3 text-xs font-semibold", className)}>
      {items.map((item) => {
        const Icon = legendIcons[item.type];

        return (
          <span key={`${item.type}-${item.label}`} className="inline-flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
