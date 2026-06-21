import { CheckCircle2, LifeBuoy, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { TransportAlertsPanel } from "@/components/fleet/transport/TransportAlertsPanel";
import { TransportDriverAvailability } from "@/components/fleet/transport/TransportDriverAvailability";
import { TransportFleetMap } from "@/components/fleet/transport/TransportFleetMap";
import { TransportKpiGrid } from "@/components/fleet/transport/TransportKpiGrid";
import { TransportRideQueue } from "@/components/fleet/transport/TransportRideQueue";
import { TransportVehicleStatus } from "@/components/fleet/transport/TransportVehicleStatus";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { getTransportFleetStats } from "@/services/transportFleet";
import { transportFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { formatCurrency } from "@/utils/format";

export function TransportFleetDashboardPage() {
  const { toast } = useToast();
  const stats = getTransportFleetStats();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <FleetSectionNav label="Transport fleet sections" items={transportFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Transport Fleet Dashboard</p>
        <h1 className="mt-1 text-2xl font-semibold">Ride-hailing operations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Standard and Premium rides only: drivers, cars, pickup demand, live rides and transport earnings.
        </p>
      </header>

      <TransportKpiGrid />
      <TransportFleetMap />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <TransportRideQueue />
        <TransportDriverAvailability />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <TransportVehicleStatus />
        <div className="space-y-4">
          <Card className="rounded-3xl p-4">
            <h2 className="font-semibold">Earnings</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniMetric label="Gross today" value={formatCurrency(stats.grossEarningsToday)} />
              <MiniMetric label="Cash rides" value={formatCurrency(stats.cashEarningsToday)} />
              <MiniMetric label="Card rides" value={formatCurrency(stats.cardEarningsToday)} />
              <MiniMetric label="Average fare" value={formatCurrency(stats.averageFare)} />
            </div>
          </Card>
          <Card className="rounded-3xl p-4">
            <h2 className="font-semibold">Primary actions</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() =>
                  toast({
                    title: "Șofer aprobat în demo",
                    description: "Cel mai recent șofer pending a fost mutat în coada aprobată.",
                    tone: "success"
                  })
                }
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Approve driver
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  toast({
                    title: "Mentenanță programată",
                    description: "Vehiculul cu documente aproape expirate a fost marcat pentru verificare.",
                    tone: "warning"
                  })
                }
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                Mark maintenance
              </Button>
              <Button asChild variant="outline">
                <Link to="/fleet-manager/support/new">
                  <LifeBuoy className="h-4 w-4" aria-hidden="true" />
                  Support ticket
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <TransportAlertsPanel />
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-muted/55 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
