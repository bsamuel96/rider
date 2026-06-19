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
};

export function MapServiceDock({ value, onChange }: MapServiceDockProps) {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border/60 bg-background/85 p-2 shadow-floating backdrop-blur-xl">
      {serviceItems.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onChange(item.type)}
          className={cn(
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === item.type && "bg-primary text-primary-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </button>
      ))}
    </div>
  );
}
