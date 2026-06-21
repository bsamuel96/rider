import { Banknote, Clock, MapPin, Phone, Route, XCircle } from "lucide-react";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { NavigateToCustomerButton } from "@/components/navigation/NavigateToCustomerButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { getDriverStatusDescription, getDriverStatusLabel } from "@/services/driverWorkflow";
import type { DriverActiveBooking, DriverWorkflowAction, DriverWorkflowStatus } from "@/types/domain";
import { formatCurrency, formatDistance } from "@/utils/format";

export type DriverActiveRideSheetProps = {
  booking: DriverActiveBooking;
  status: DriverWorkflowStatus;
  primaryAction?: DriverWorkflowAction;
  etaToPickupMinutes?: number;
  etaToDestinationMinutes?: number;
  distanceToDestinationKm?: number;
  onPrimaryAction: () => void;
  onCancelRide: () => void;
};

export function DriverActiveRideSheet({
  booking,
  status,
  primaryAction,
  etaToPickupMinutes,
  etaToDestinationMinutes,
  distanceToDestinationKm,
  onPrimaryAction,
  onCancelRide
}: DriverActiveRideSheetProps) {
  const { toast } = useToast();
  const navigatesToDestination = ["trip_started", "en_route_to_destination", "arrived_at_destination"].includes(status);
  const navigationCoordinates = navigatesToDestination ? booking.destination : booking.pickup;
  const navigationLabel = navigatesToDestination ? booking.destinationAddress : booking.pickupAddress;

  return (
    <MapFloatingPanel className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{getDriverStatusLabel(status)}</p>
          <h2 className="mt-1 text-lg font-semibold">{booking.customerName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{getDriverStatusDescription(status)}</p>
        </div>
        <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold">
          {booking.paymentMethod === "cash" ? "Cash" : "Card"} · {formatCurrency(booking.fareEstimate)}
        </span>
      </div>

      <div className="grid gap-2 text-sm">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-semibold">{booking.pickupAddress}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {booking.destinationAddress}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-muted/60 p-3">
          <Clock className="mb-1 h-4 w-4 text-primary" aria-hidden="true" />
          <strong>{etaToPickupMinutes ?? etaToDestinationMinutes ?? booking.etaToPickupMinutes} min</strong>
          <p className="text-muted-foreground">ETA</p>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <Route className="mb-1 h-4 w-4 text-primary" aria-hidden="true" />
          <strong>{formatDistance(distanceToDestinationKm ?? booking.routeDistanceKm)}</strong>
          <p className="text-muted-foreground">Rută</p>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <Banknote className="mb-1 h-4 w-4 text-primary" aria-hidden="true" />
          <strong>{formatCurrency(booking.fareEstimate)}</strong>
          <p className="text-muted-foreground">Total</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1.5fr] gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast({
              title: "Apel demo inițiat",
              description: `În demo, ${booking.customerName} a fost notificat că îl vei suna.`,
              tone: "success"
            })
          }
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Sună
        </Button>
        <Button type="button" onClick={onPrimaryAction} disabled={!primaryAction}>
          {primaryAction?.label ?? "Continuă"}
        </Button>
      </div>

      <NavigateToCustomerButton coordinates={navigationCoordinates} label={navigationLabel} compact>
        {navigatesToDestination ? "Navighează la destinație" : "Navighează la client"}
      </NavigateToCustomerButton>

      <button
        type="button"
        onClick={onCancelRide}
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <XCircle className="h-4 w-4" aria-hidden="true" />
        Anulează cursa
      </button>
    </MapFloatingPanel>
  );
}
