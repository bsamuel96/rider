import { Eye, UserRound } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { transportFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getTransportDrivers } from "@/services/transportFleet";

export function TransportDriversPage() {
  const { toast } = useToast();
  const drivers = getTransportDrivers();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Transport fleet sections" items={transportFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Transport drivers</p>
        <h1 className="mt-1 text-2xl font-semibold">Driver availability and approvals</h1>
        <p className="mt-2 text-sm text-muted-foreground">Drivers for Standard and Premium rides only.</p>
      </header>
      <Card className="rounded-3xl p-4">
        <div className="grid gap-3">
          {drivers.map((driver) => (
            <div key={driver.id} className="flex flex-col gap-3 rounded-2xl bg-muted/55 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{driver.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {driver.phone} · {driver.rating ? `${driver.rating.toFixed(2)} ★` : "pending review"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={driver.status === "online" ? "secondary" : "outline"}>{driver.status}</Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Profil șofer deschis în demo",
                      description: `${driver.name}: ${driver.status}, rating ${driver.rating ? driver.rating.toFixed(2) : "în review"}.`,
                      tone: "default"
                    })
                  }
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View driver
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
