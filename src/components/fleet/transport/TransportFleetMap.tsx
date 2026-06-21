import { Car, MapPin, Navigation, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTransportDrivers, getTransportRides } from "@/services/transportFleet";
import { cn } from "@/utils/cn";

export function TransportFleetMap() {
  const drivers = getTransportDrivers();
  const rides = getTransportRides();

  return (
    <Card className="relative min-h-[320px] overflow-hidden rounded-3xl border-border/60 bg-[radial-gradient(circle_at_15%_20%,rgba(20,184,166,0.18),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.08),rgba(255,255,255,0.72))] p-4">
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Live Transport Map</p>
          <h2 className="mt-1 text-lg font-semibold">Drivers, pickups, destinations</h2>
        </div>
        <Badge variant="secondary">{drivers.filter((driver) => driver.status === "online").length} online</Badge>
      </div>

      <div className="absolute inset-0 opacity-45">
        <div className="absolute left-0 top-1/3 h-px w-full bg-border" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-border" />
        <div className="absolute left-1/3 top-0 h-full w-px bg-border" />
        <div className="absolute left-2/3 top-0 h-full w-px bg-border" />
      </div>

      {drivers.slice(0, 3).map((driver, index) => (
        <MapMarker
          key={driver.id}
          className={index === 0 ? "left-[18%] top-[48%]" : index === 1 ? "left-[56%] top-[37%]" : "left-[72%] top-[67%]"}
          icon={Car}
          label={driver.name}
          tone={driver.status === "busy" ? "busy" : "available"}
        />
      ))}

      {rides.slice(0, 3).map((ride, index) => (
        <MapMarker
          key={ride.id}
          className={index === 0 ? "left-[32%] top-[24%]" : index === 1 ? "left-[68%] top-[22%]" : "left-[43%] top-[72%]"}
          icon={ride.status === "searching_driver" ? MapPin : Route}
          label={ride.pickup}
          tone={ride.status === "searching_driver" ? "warning" : "route"}
        />
      ))}

      <div className="absolute bottom-4 left-4 right-4 z-10 grid gap-2 sm:grid-cols-3">
        {rides.map((ride) => (
          <div key={ride.id} className="rounded-2xl bg-background/80 p-3 text-xs shadow-soft backdrop-blur-xl">
            <p className="font-semibold">{ride.serviceType === "premium" ? "Premium" : "Standard"}</p>
            <p className="mt-1 text-muted-foreground">
              {ride.pickup} to {ride.destination}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

type MapMarkerProps = {
  className: string;
  icon: typeof Car;
  label: string;
  tone: "available" | "busy" | "warning" | "route";
};

function MapMarker({ className, icon: Icon, label, tone }: MapMarkerProps) {
  return (
    <div className={cn("absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1", className)}>
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full text-white shadow-floating",
          tone === "available" && "bg-emerald-600",
          tone === "busy" && "bg-sky-600",
          tone === "warning" && "bg-amber-600",
          tone === "route" && "bg-primary"
        )}
      >
        {tone === "route" ? <Navigation className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
      </span>
      <span className="max-w-24 truncate rounded-full bg-background/85 px-2 py-1 text-[11px] font-semibold shadow-soft backdrop-blur-xl">
        {label}
      </span>
    </div>
  );
}
