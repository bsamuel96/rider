import { cn } from "@/utils/cn";

export type DriverActivityTab = "hours" | "rides" | "cancellations";

const tabs: { value: DriverActivityTab; label: string }[] = [
  { value: "hours", label: "Ore online" },
  { value: "rides", label: "Curse" },
  { value: "cancellations", label: "Anulări" }
];

type DriverActivityTabsProps = {
  value: DriverActivityTab;
  onChange: (value: DriverActivityTab) => void;
};

export function DriverActivityTabs({ value, onChange }: DriverActivityTabsProps) {
  return (
    <div className="grid grid-cols-3 rounded-2xl border border-border/60 bg-muted p-1" role="tablist" aria-label="Activitate șofer">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "min-h-10 rounded-xl px-2 text-xs font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === tab.value && "bg-background text-foreground shadow-sm"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
