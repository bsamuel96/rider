import { AlertTriangle, CheckCircle2, Clock3, Truck, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RoadsideGuaranteeBanner } from "@/components/roadside/RoadsideGuaranteeBanner";
import { demoFleetJobs, demoFleetPeople, demoFleetSummary, demoFleetVehicles } from "@/data/demoFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideFleetPage() {
  const roadsideVehicles = demoFleetVehicles.filter((vehicle) => vehicle.fleetType === "roadside");
  const operators = demoFleetPeople.filter((person) => person.fleetType === "roadside");
  const requests = demoFleetJobs.filter((job) => job.fleetType === "roadside");

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">Roadside Assistance Fleet</p>
        <h1 className="mt-1 text-2xl font-semibold">Tow, service, fast SLA</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Flota roadside urmărește separat vehiculele de intervenție, operatorii, cererile Rapid și confirmările clientului.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={Wrench} label="Operatori activi" value={demoFleetSummary.roadside.activeOperators} />
        <MetricCard icon={Truck} label="Vehicule service" value={demoFleetSummary.roadside.serviceVehicles} />
        <MetricCard icon={Clock3} label="Solicitări active" value={demoFleetSummary.roadside.activeRequests} />
        <MetricCard icon={AlertTriangle} label="SLA Rapid risc" value={demoFleetSummary.roadside.fastSlaRisk} warning />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Fast guarantee queue</h2>
            <Badge variant="warning">30 min</Badge>
          </div>
          <div className="mt-3 grid gap-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-2xl bg-muted/55 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{request.label}</p>
                  <Badge variant={request.speedTier === "fast" ? "warning" : "secondary"}>
                    {request.speedTier === "fast" ? "Rapid" : "Normal"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {request.assignee} · {request.status} · {formatCurrency(request.valueRon)}
                </p>
                {request.speedTier === "fast" && (
                  <div className="mt-3">
                    <RoadsideGuaranteeBanner status="active" remainingMinutes={request.guaranteeMinutesLeft || 0} operatorView />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Confirmări client</h2>
          <div className="mt-4 space-y-3">
            <ConfirmationRow label="Sosire la client" value={demoFleetSummary.roadside.arrivalPendingConfirmations} />
            <ConfirmationRow label="Problemă rezolvată" value={demoFleetSummary.roadside.solvedPendingConfirmations} />
            <ConfirmationRow label="Garanții aplicate" value={0} done />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Roadside operators</h2>
          <div className="mt-3 grid gap-2">
            {operators.map((operator) => (
              <FleetRow key={operator.id} title={operator.name} subtitle={operator.activeJob || operator.phone} badge={operator.status} />
            ))}
          </div>
        </Card>
        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Tow / service vehicles</h2>
          <div className="mt-3 grid gap-2">
            {roadsideVehicles.map((vehicle) => (
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
  icon: typeof Truck;
  label: string;
  value: string | number;
  warning?: boolean;
};

function MetricCard({ icon: Icon, label, value, warning }: MetricCardProps) {
  return (
    <Card className="rounded-3xl p-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      {warning && (
        <Badge variant="warning" className="mt-2">
          Atenție
        </Badge>
      )}
    </Card>
  );
}

function ConfirmationRow({ label, value, done }: { label: string; value: number; done?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-muted/55 p-3">
      <span className="flex items-center gap-2 text-sm font-semibold">
        {done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function FleetRow({ title, subtitle, badge }: { title: string; subtitle: string; badge: string }) {
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
