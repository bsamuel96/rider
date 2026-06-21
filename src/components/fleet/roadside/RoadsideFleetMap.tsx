import { AlertTriangle, MapPin, ShieldAlert, Truck, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getRoadsideOperators, getRoadsideRequests, getRoadsideVehicles } from "@/services/roadsideFleet";
import { cn } from "@/utils/cn";

export function RoadsideFleetMap() {
  const operators = getRoadsideOperators();
  const vehicles = getRoadsideVehicles();
  const requests = getRoadsideRequests();

  return (
    <Card className="relative min-h-[340px] overflow-hidden rounded-3xl border-border/60 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.18),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.1),rgba(255,255,255,0.74))] p-4">
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Live Roadside Map</p>
          <h2 className="mt-1 text-lg font-semibold">Operators, tow trucks, incidents</h2>
        </div>
        <Badge variant="warning">{requests.filter((request) => request.speedTier === "fast").length} fast</Badge>
      </div>

      <div className="absolute inset-0 opacity-45">
        <div className="absolute left-0 top-1/4 h-px w-full bg-border" />
        <div className="absolute left-0 top-3/4 h-px w-full bg-border" />
        <div className="absolute left-1/4 top-0 h-full w-px bg-border" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-border" />
      </div>

      {vehicles.slice(0, 3).map((vehicle, index) => (
        <MapMarker
          key={vehicle.id}
          className={index === 0 ? "left-[18%] top-[55%]" : index === 1 ? "left-[61%] top-[34%]" : "left-[72%] top-[68%]"}
          icon={vehicle.vehicleType === "tow_truck" ? Truck : Wrench}
          label={vehicle.plateNumber}
          tone="operator"
        />
      ))}

      {requests.map((request, index) => (
        <MapMarker
          key={request.id}
          className={
            index === 0
              ? "left-[34%] top-[24%]"
              : index === 1
                ? "left-[52%] top-[58%]"
                : index === 2
                  ? "left-[78%] top-[28%]"
                  : "left-[22%] top-[76%]"
          }
          icon={request.speedTier === "fast" ? AlertTriangle : MapPin}
          label={request.customerLocation}
          tone={request.speedTier === "fast" ? "fast" : "request"}
        />
      ))}

      <div className="absolute bottom-4 left-4 right-4 z-10 grid gap-2 sm:grid-cols-3">
        {operators.slice(0, 3).map((operator) => (
          <div key={operator.id} className="rounded-2xl bg-background/82 p-3 text-xs shadow-soft backdrop-blur-xl">
            <p className="font-semibold">{operator.name}</p>
            <p className="mt-1 text-muted-foreground">{operator.serviceTypes.join(", ")}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

type MapMarkerProps = {
  className: string;
  icon: typeof Truck;
  label: string;
  tone: "operator" | "request" | "fast";
};

function MapMarker({ className, icon: Icon, label, tone }: MapMarkerProps) {
  return (
    <div className={cn("absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1", className)}>
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full text-white shadow-floating",
          tone === "operator" && "bg-sky-700",
          tone === "request" && "bg-primary",
          tone === "fast" && "bg-amber-600"
        )}
      >
        {tone === "fast" ? <ShieldAlert className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
      </span>
      <span className="max-w-28 truncate rounded-full bg-background/85 px-2 py-1 text-[11px] font-semibold shadow-soft backdrop-blur-xl">
        {label}
      </span>
    </div>
  );
}
