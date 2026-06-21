import { AlertTriangle, Clock3, Truck, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getRoadsideFleetStats } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideKpiGrid() {
  const stats = getRoadsideFleetStats();
  const items = [
    { label: "Online operators", value: stats.onlineOperators, icon: Wrench },
    { label: "Tow trucks", value: stats.activeTowTrucks, icon: Truck },
    { label: "Fast SLA risk", value: stats.fastRequestsAtRisk, icon: AlertTriangle },
    { label: "Roadside earnings", value: formatCurrency(stats.grossEarningsToday), icon: Clock3 }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="rounded-3xl p-4">
          <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-xs text-muted-foreground">{item.label}</p>
          <p className="text-xl font-semibold">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
