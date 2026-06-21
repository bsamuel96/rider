import { Banknote, Car, RadioTower, Route } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTransportFleetStats } from "@/services/transportFleet";
import { formatCurrency } from "@/utils/format";

export function TransportKpiGrid() {
  const stats = getTransportFleetStats();
  const items = [
    { label: "Online drivers", value: stats.onlineDrivers, icon: RadioTower },
    { label: "Active cars", value: stats.activeCars, icon: Car },
    { label: "Rides in progress", value: stats.ridesInProgress, icon: Route },
    { label: "Transport earnings", value: formatCurrency(stats.grossEarningsToday), icon: Banknote }
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
