import { MapPin, Search } from "lucide-react";
import { cn } from "@/utils/cn";

type LocationPickerMode = "search" | "map";

type LocationSearchOrPinTabsProps = {
  value: LocationPickerMode;
  onChange: (value: LocationPickerMode) => void;
};

const tabs: Array<{ value: LocationPickerMode; label: string; icon: typeof Search }> = [
  { value: "search", label: "Caută adresă", icon: Search },
  { value: "map", label: "Alege pe hartă", icon: MapPin }
];

export function LocationSearchOrPinTabs({ value, onChange }: LocationSearchOrPinTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/70 p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-background text-foreground shadow-map-control" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
