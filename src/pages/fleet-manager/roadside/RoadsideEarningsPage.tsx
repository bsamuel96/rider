import { Banknote, CreditCard, ShieldAlert } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Card } from "@/components/ui/card";
import { roadsideFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getRoadsideFleetStats, getRoadsideRequests } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideEarningsPage() {
  const stats = getRoadsideFleetStats();
  const requests = getRoadsideRequests();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Roadside fleet sections" items={roadsideFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Roadside earnings</p>
        <h1 className="mt-1 text-2xl font-semibold">Tow and assistance revenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Normal, Rapid, guarantee discounts and cash/card split for roadside only.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={Banknote} label="Gross today" value={formatCurrency(stats.grossEarningsToday)} />
        <MetricCard icon={ShieldAlert} label="Fast revenue" value={formatCurrency(stats.fastRequestsRevenue)} />
        <MetricCard icon={Banknote} label="Normal revenue" value={formatCurrency(stats.normalRequestsRevenue)} />
        <MetricCard icon={CreditCard} label="Guarantee discounts" value={formatCurrency(stats.guaranteeDiscountsApplied)} />
      </div>
      <Card className="rounded-3xl p-4">
        <h2 className="font-semibold">Recent roadside revenue</h2>
        <div className="mt-3 grid gap-2">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between rounded-2xl bg-muted/55 p-3 text-sm">
              <span>{request.label}</span>
              <strong>{formatCurrency(request.finalPriceRon)}</strong>
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
