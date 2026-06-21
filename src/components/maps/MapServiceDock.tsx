import { Car, Sparkles, Truck, Wrench } from "lucide-react";
import type { ServiceType } from "@/types/domain";
import { cn } from "@/utils/cn";

const serviceItems: { type: ServiceType; label: string; icon: typeof Car }[] = [
  { type: "standard", label: "Standard", icon: Car },
  { type: "premium", label: "Premium", icon: Sparkles },
  { type: "tow", label: "Tractare", icon: Truck },
  { type: "roadside", label: "Asistență", icon: Wrench }
];

type MapServiceDockProps = {
  value?: ServiceType;
  onChange: (serviceType: ServiceType) => void;
  compact?: boolean;
};

export function MapServiceDock({ value, onChange, compact }: MapServiceDockProps) {
  return (
    <div className={cn("glass-dock map-layer-dock grid grid-cols-4 gap-2 p-2", compact && "gap-1 p-1.5")}>
      {serviceItems.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onChange(item.type)}
          className={cn(
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            compact && "min-h-[62px] px-1 text-[10px] sm:text-xs",
            value === item.type && "bg-primary text-primary-foreground shadow-map-control"
          )}
        >
          <item.icon className={cn("h-4 w-4", compact && "h-[18px] w-[18px]")} />
          {item.label}
        </button>
      ))}
    </div>
  );
}
