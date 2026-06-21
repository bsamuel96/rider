import { Banknote, Car, CreditCard, RadioTower, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { demoFleetJobs, demoFleetPeople, demoFleetSummary, demoFleetVehicles } from "@/data/demoFleet";
import { formatCurrency } from "@/utils/format";

export function TransportFleetPage() {
  const transportVehicles = demoFleetVehicles.filter((vehicle) => vehicle.fleetType === "transport");
  const drivers = demoFleetPeople.filter((person) => person.fleetType === "transport");
  const jobs = demoFleetJobs.filter((job) => job.fleetType === "transport");

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">Normal Transport Fleet</p>
        <h1 className="mt-1 text-2xl font-semibold">Cars, drivers, rides</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Flota Uber-like rămâne separată de roadside: standard/premium, curse și split cash/card.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={RadioTower} label="Șoferi activi" value={demoFleetSummary.transport.activeDrivers} />
        <MetricCard icon={Car} label="Mașini active" value={demoFleetSummary.transport.activeVehicles} />
        <MetricCard icon={Route} label="Curse azi" value={demoFleetSummary.transport.ridesToday} />
        <MetricCard icon={Banknote} label="Încasări" value={formatCurrency(demoFleetSummary.transport.earningsTodayRon)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Ride operations</h2>
          <div className="mt-3 grid gap-3">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-2xl bg-muted/55 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{job.label}</p>
                  <Badge variant="secondary">{job.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {job.assignee} · {formatCurrency(job.valueRon)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Cash / card split</h2>
          <div className="mt-4 space-y-3">
            <SplitRow icon={Banknote} label="Cash" value="42%" />
            <SplitRow icon={CreditCard} label="Card" value="58%" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">În review, plata preferată a clientului rămâne editabilă înainte de confirmare.</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Drivers online</h2>
          <div className="mt-3 grid gap-2">
            {drivers.map((driver) => (
              <FleetRow key={driver.id} title={driver.name} subtitle={driver.activeJob || driver.phone} badge={driver.status} />
            ))}
          </div>
        </Card>
        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Transport vehicles</h2>
          <div className="mt-3 grid gap-2">
            {transportVehicles.map((vehicle) => (
              <FleetRow
                key={vehicle.id}
                title={`${vehicle.brand} ${vehicle.model}`}
                subtitle={`${vehicle.plateNumber} · ${vehicle.service}`}
                badge={vehicle.status}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: typeof Car;
  label: string;
  value: string | number;
};

function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <Card className="rounded-3xl p-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </Card>
  );
}

type FleetRowProps = {
  title: string;
  subtitle: string;
  badge: string;
};

function FleetRow({ title, subtitle, badge }: FleetRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/55 p-3">
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <Badge variant={badge === "active" || badge === "online" ? "secondary" : "outline"}>{badge}</Badge>
    </div>
  );
}

function SplitRow({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-muted/55 p-3">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}
