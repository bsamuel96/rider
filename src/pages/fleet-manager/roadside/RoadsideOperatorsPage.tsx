import { Phone, Wrench } from "lucide-react";
import { FleetSectionNav } from "@/components/fleet/FleetSectionNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { roadsideFleetNavItems } from "@/pages/fleet-manager/fleetSubnav";
import { getRoadsideOperators } from "@/services/roadsideFleet";

export function RoadsideOperatorsPage() {
  const { toast } = useToast();
  const operators = getRoadsideOperators();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <FleetSectionNav label="Roadside fleet sections" items={roadsideFleetNavItems} />
      <header>
        <p className="text-sm font-semibold text-primary">Roadside operators</p>
        <h1 className="mt-1 text-2xl font-semibold">Tow and intervention staff</h1>
        <p className="mt-2 text-sm text-muted-foreground">Operators for towing, battery, tire, fuel, accident and engine issues.</p>
      </header>
      <Card className="rounded-3xl p-4">
        <div className="grid gap-3">
          {operators.map((operator) => (
            <div key={operator.id} className="flex flex-col gap-3 rounded-2xl bg-muted/55 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
                  <Wrench className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{operator.name}</span>
                  <span className="block text-xs text-muted-foreground">{operator.serviceTypes.join(", ")}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={operator.status === "online" ? "secondary" : "outline"}>{operator.status}</Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Contact operator demo",
                      description: `${operator.name} a primit o notificare de contact.`,
                      tone: "success"
                    })
                  }
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Contact operator
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
