import { Eye, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/useToast";
import { getTransportRides } from "@/services/transportFleet";
import { formatCurrency } from "@/utils/format";

export function TransportRideQueue() {
  const { toast } = useToast();
  const rides = getTransportRides();

  return (
    <Card className="rounded-3xl p-4">
      <h2 className="font-semibold">Ride Operations</h2>
      <p className="mt-1 text-sm text-muted-foreground">Standard and Premium ride queue only.</p>
      <div className="mt-4 grid gap-3">
        {rides.length === 0 && (
          <EmptyState title="Nu există curse active" description="Cererile de transport standard și premium vor apărea aici." />
        )}
        {rides.map((ride) => (
          <div key={ride.id} className="rounded-2xl bg-muted/55 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <span className="block text-sm font-semibold">
                  {ride.pickup} to {ride.destination}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {ride.serviceType} · {formatCurrency(ride.fareRon)} · {ride.paymentMethod}
                </span>
              </span>
              <Badge variant={ride.status === "searching_driver" ? "warning" : "secondary"}>{ride.status.replace(/_/g, " ")}</Badge>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Ride live deschis în demo",
                    description: `${ride.pickup} to ${ride.destination} este evidențiat pe harta transport.`,
                    tone: "default"
                  })
                }
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                View live ride
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Șofer asignat în demo",
                    description: `Cursa ${ride.serviceType} a primit cel mai apropiat șofer disponibil.`,
                    tone: "success"
                  })
                }
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Assign driver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
