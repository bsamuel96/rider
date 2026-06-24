import { useState } from "react";
import { Clock3, Route, XCircle } from "lucide-react";
import { DriverActivityChart } from "@/components/driver/activity/DriverActivityChart";
import { DriverActivityTabs, type DriverActivityTab } from "@/components/driver/activity/DriverActivityTabs";
import { DriverAdviceCarousel } from "@/components/driver/activity/DriverAdviceCarousel";
import { DriverCancellationBreakdown } from "@/components/driver/activity/DriverCancellationBreakdown";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

type Scope = "day" | "week" | "month" | "last30";

const scopes: { value: Scope; label: string }[] = [
  { value: "day", label: "Zi" },
  { value: "week", label: "Săptămână în curs" },
  { value: "month", label: "Lună" },
  { value: "last30", label: "Ultimele 30 zile" }
];

const weekdayHours = [
  { label: "L", value: 0 },
  { label: "M", value: 2.4 },
  { label: "M", value: 4.1 },
  { label: "J", value: 3.2 },
  { label: "V", value: 5.8 },
  { label: "S", value: 6.2 },
  { label: "D", value: 1.8 }
];

export function DriverActivityPage() {
  const [tab, setTab] = useState<DriverActivityTab>("hours");
  const [scope, setScope] = useState<Scope>("week");

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Activitate</p>
        <h1 className="mt-1 text-2xl font-semibold">Performanța turelor tale</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ore online, curse acceptate și anulări explicate clar.</p>
      </header>

      <DriverActivityTabs value={tab} onChange={setTab} />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {scopes.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setScope(item.value)}
            className={cn(
              "min-h-10 shrink-0 rounded-full border px-4 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              scope === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-background"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "hours" && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard icon={Clock3} label="Total ore online" value={scope === "day" ? "0 ore 0 min" : "23 ore 30 min"} />
            <MetricCard icon={Route} label="Ore în cursă" value={scope === "day" ? "0 ore" : "14 ore 10 min"} />
            <MetricCard icon={Clock3} label="Ore în așteptare" value={scope === "day" ? "0 min" : "9 ore 20 min"} />
          </div>
          <DriverActivityChart title="Numărul de ore conduse și în așteptare" values={scope === "day" ? weekdayHours.map((item) => ({ ...item, value: 0 })) : weekdayHours} />
        </>
      )}

      {tab === "rides" && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <MetricCard icon={Route} label="Acceptate" value="42" />
            <MetricCard icon={Route} label="Finalizate" value="39" />
            <MetricCard icon={Clock3} label="Rată acceptare" value="88%" />
            <MetricCard icon={Clock3} label="Rată finalizare" value="93%" />
          </div>
          <DriverActivityChart
            title="Curse finalizate pe zi"
            unit=""
            values={[
              { label: "L", value: 4 },
              { label: "M", value: 5 },
              { label: "M", value: 7 },
              { label: "J", value: 6 },
              { label: "V", value: 9 },
              { label: "S", value: 6 },
              { label: "D", value: 2 }
            ]}
          />
        </>
      )}

      {tab === "cancellations" && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard icon={XCircle} label="Anulări totale" value="11" />
            <MetricCard icon={Clock3} label="Neacceptate" value="5" />
            <MetricCard icon={Route} label="Risc campanii" value="Scăzut" />
          </div>
          <DriverCancellationBreakdown />
          <DriverAdviceCarousel />
        </>
      )}
    </div>
  );
}

type MetricCardProps = {
  icon: typeof Clock3;
  label: string;
  value: string;
};

function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <Card className="p-4">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <p className="mt-3 text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
    </Card>
  );
}
