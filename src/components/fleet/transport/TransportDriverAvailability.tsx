import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTransportDrivers, getTransportFleetStats } from "@/services/transportFleet";

export function TransportDriverAvailability() {
  const stats = getTransportFleetStats();
  const drivers = getTransportDrivers();

  return (
    <Card className="rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">Driver Availability</h2>
          <p className="text-sm text-muted-foreground">
            {stats.onlineDrivers} online · {stats.busyDrivers} busy · {stats.offlineDrivers} offline
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {drivers.map((driver) => (
          <div key={driver.id} className="flex items-center justify-between gap-3 rounded-2xl bg-muted/55 p-3">
            <span>
              <span className="block text-sm font-semibold">{driver.name}</span>
              <span className="block text-xs text-muted-foreground">
                {driver.rating ? `${driver.rating.toFixed(2)} ★` : "În review"} · seen {driver.lastSeenMinutesAgo} min ago
              </span>
            </span>
            <Badge variant={driver.status === "online" ? "secondary" : driver.status === "busy" ? "default" : "outline"}>
              {driver.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
