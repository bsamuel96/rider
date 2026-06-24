import { AlertTriangle, LifeBuoy, MessageSquareWarning } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { RoadsideAlertsPanel } from "@/components/fleet/roadside/RoadsideAlertsPanel";
import { RoadsideConfirmationQueue } from "@/components/fleet/roadside/RoadsideConfirmationQueue";
import { RoadsideFastSlaPanel } from "@/components/fleet/roadside/RoadsideFastSlaPanel";
import { RoadsideFleetMap } from "@/components/fleet/roadside/RoadsideFleetMap";
import { RoadsideKpiGrid } from "@/components/fleet/roadside/RoadsideKpiGrid";
import { RoadsideOperatorAvailability } from "@/components/fleet/roadside/RoadsideOperatorAvailability";
import { RoadsideRequestQueue } from "@/components/fleet/roadside/RoadsideRequestQueue";
import { RoadsideVehicleStatus } from "@/components/fleet/roadside/RoadsideVehicleStatus";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { useToast } from "@/hooks/useToast";
import { roadsideFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getRoadsideFleetStats } from "@/services/roadsideFleet";
import { formatCurrency } from "@/utils/format";

export function RoadsideFleetDashboardPage() {
  const { toast } = useToast();
  const stats = getRoadsideFleetStats();
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <FleetSectionNav label="Roadside fleet sections" items={roadsideFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Roadside Assistance Fleet Dashboard</p>
        <h1 className="mt-1 text-2xl font-semibold">Tow and intervention operations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Roadside-only operations: operators, tow trucks, service vans, Fast SLA, confirmations and disputes.
        </p>
      </header>

      <RoadsideKpiGrid />
      <RoadsideFleetMap />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <RoadsideRequestQueue />
        <RoadsideFastSlaPanel />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <RoadsideOperatorAvailability />
        <RoadsideVehicleStatus />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <RoadsideConfirmationQueue />
        <div className="space-y-4">
          <Card className="rounded-3xl p-4">
            <h2 className="font-semibold">Equipment / Service Capability</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniMetric label="Battery support" value="4 vans" />
              <MiniMetric label="Flat tire support" value="5 teams" />
              <MiniMetric label="Tow capable" value={`${stats.activeTowTrucks} trucks`} />
              <MiniMetric label="Fuel delivery" value="3 teams" />
              <MiniMetric label="Accident response" value="2 teams" />
              <MiniMetric label="Service vans equipped" value={stats.activeServiceVans} />
            </div>
          </Card>
          <Card className="rounded-3xl p-4">
            <h2 className="font-semibold">Earnings</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniMetric label="Gross today" value={formatCurrency(stats.grossEarningsToday)} />
              <MiniMetric label="Fast revenue" value={formatCurrency(stats.fastRequestsRevenue)} />
              <MiniMetric label="Normal revenue" value={formatCurrency(stats.normalRequestsRevenue)} />
              <MiniMetric label="Guarantee discounts" value={formatCurrency(stats.guaranteeDiscountsApplied)} />
            </div>
          </Card>
          <Card className="rounded-3xl p-4">
            <h2 className="font-semibold">Primary actions</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() =>
                  toast({
                    title: "Solicitare escaladată în demo",
                    description: "Cea mai urgentă solicitare rapidă a fost trimisă către suport operațional.",
                    tone: "warning"
                  })
                }
              >
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Escalate request
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  toast({
                    title: "Dispută deschisă pentru review",
                    description: "Fluxul demo marchează disputa ca preluată de suport.",
                    tone: "success"
                  })
                }
              >
                <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
                Resolve dispute
              </Button>
              <Button asChild variant="outline">
                <Link to="/fleet-manager/support/new">
                  <LifeBuoy className="h-4 w-4" aria-hidden="true" />
                  Support ticket
                </Link>
              </Button>
              <Button type="button" variant="outline" onClick={() => setBriefOpen(true)}>
                Operations brief
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <RoadsideAlertsPanel />

      {briefOpen && (
        <MinimizableBottomSheet
          title="Roadside operations brief"
          description="Tow and intervention snapshot."
          initialState="half"
          dismissible
          onStateChange={(state) => state === "closed" && setBriefOpen(false)}
        >
          <div className="grid gap-3">
            <MiniMetric label="Active operators" value={stats.onlineOperators} />
            <MiniMetric label="Arrival confirmations pending" value={stats.arrivalConfirmationsPending} />
            <MiniMetric label="Issue solved confirmations pending" value={stats.solvedConfirmationsPending} />
            <MiniMetric label="Fast guarantee risk" value={stats.fastRequestsAtRisk} />
          </div>
        </MinimizableBottomSheet>
      )}
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
