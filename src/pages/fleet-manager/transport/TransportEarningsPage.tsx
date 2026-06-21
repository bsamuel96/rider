import { Banknote, CreditCard } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Card } from "@/components/ui/card";
import { transportFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getTransportFleetStats, getTransportRides } from "@/services/transportFleet";
import { formatCurrency } from "@/utils/format";

export function TransportEarningsPage() {
  const stats = getTransportFleetStats();
  const rides = getTransportRides();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Transport fleet sections" items={transportFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Transport earnings</p>
        <h1 className="mt-1 text-2xl font-semibold">Ride revenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Cash/card split and average fare for ride-hailing only.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={Banknote} label="Gross today" value={formatCurrency(stats.grossEarningsToday)} />
        <MetricCard icon={Banknote} label="Cash rides" value={formatCurrency(stats.cashEarningsToday)} />
        <MetricCard icon={CreditCard} label="Card rides" value={formatCurrency(stats.cardEarningsToday)} />
        <MetricCard icon={Banknote} label="Average fare" value={formatCurrency(stats.averageFare)} />
      </div>
      <Card className="rounded-3xl p-4">
        <h2 className="font-semibold">Recent transport revenue</h2>
        <div className="mt-3 grid gap-2">
          {rides.map((ride) => (
            <div key={ride.id} className="flex items-center justify-between rounded-2xl bg-muted/55 p-3 text-sm">
              <span>
                {ride.pickup} to {ride.destination}
              </span>
              <strong>{formatCurrency(ride.fareRon)}</strong>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Banknote; label: string; value: string }) {
  return (
    <Card className="rounded-3xl p-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </Card>
  );
}
