import { cn } from "@/utils/cn";

export type DriverEarningsPeriod = "day" | "week" | "month";

const periods: { value: DriverEarningsPeriod; label: string }[] = [
  { value: "day", label: "Zilnic" },
  { value: "week", label: "Săptămânal" },
  { value: "month", label: "Lunar" }
];

type DriverEarningsTabsProps = {
  value: DriverEarningsPeriod;
  onChange: (value: DriverEarningsPeriod) => void;
};

export function DriverEarningsTabs({ value, onChange }: DriverEarningsTabsProps) {
  return (
    <div className="grid grid-cols-3 rounded-2xl border border-border/60 bg-muted p-1" role="tablist" aria-label="Perioadă câștiguri">
      {periods.map((period) => (
        <button
          key={period.value}
          type="button"
          role="tab"
          aria-selected={value === period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "min-h-10 rounded-xl px-3 text-sm font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === period.value && "bg-background text-foreground shadow-sm"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
