import { BarChart3, CircleCheck, Star } from "lucide-react";

const performance = [
  { label: "Scorul șoferului", value: "92", helper: "Foarte bun", icon: BarChart3 },
  { label: "Evaluare", value: "4.96", helper: "Ultimele 100 curse", icon: Star },
  { label: "Acceptare", value: "88%", helper: "Săptămâna curentă", icon: CircleCheck }
];

export function DriverPerformanceCards() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {performance.map((item) => (
        <article key={item.label} className="rounded-2xl border border-border/60 bg-background/70 p-3">
          <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
          <p className="mt-2 text-lg font-semibold">{item.value}</p>
          <p className="text-[11px] font-semibold text-muted-foreground">{item.label}</p>
          <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">{item.helper}</p>
        </article>
      ))}
    </div>
  );
}
