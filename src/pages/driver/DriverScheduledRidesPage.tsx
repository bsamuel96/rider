import { useState } from "react";
import { CalendarClock, CheckCircle2, MapPin, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/format";

type ScheduledRideStatus = "new" | "accepted" | "declined";

const initialRides = [
  { id: "scheduled-1", time: "Mâine, 07:30", pickup: "Băneasa Shopping City", destination: "Aeroport Otopeni", area: "Nord", fare: 74, status: "new" as ScheduledRideStatus },
  { id: "scheduled-2", time: "Vineri, 18:15", pickup: "Piața Unirii", destination: "Voluntari", area: "Centru", fare: 52, status: "new" as ScheduledRideStatus },
  { id: "scheduled-3", time: "Sâmbătă, 09:00", pickup: "Tineretului", destination: "Therme", area: "Sud", fare: 91, status: "new" as ScheduledRideStatus }
];

export function DriverScheduledRidesPage() {
  const [rides, setRides] = useState(initialRides);
  const { toast } = useToast();

  const updateRide = (id: string, status: ScheduledRideStatus) => {
    setRides((current) => current.map((ride) => (ride.id === id ? { ...ride, status } : ride)));
    toast({
      title: status === "accepted" ? "Cursă programată acceptată" : "Cursă programată refuzată",
      description: "Starea a fost actualizată în demo.",
      tone: status === "accepted" ? "success" : "warning"
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Curse programate</p>
        <h1 className="mt-1 text-2xl font-semibold">Planifică următoarele curse</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acceptă sau refuză cereri programate pe zonă și dată.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Toate zonele", "Azi", "Mâine", "Nord", "Centru", "Sud"].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => toast({ title: `Filtru: ${filter}`, description: "Demo: lista a fost filtrată vizual." })}
            className="min-h-10 shrink-0 rounded-full border border-border/60 bg-background px-4 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="grid gap-3">
        {rides.map((ride) => (
          <Card key={ride.id} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                  <p className="font-semibold">{ride.time}</p>
                  <Badge variant={ride.status === "accepted" ? "secondary" : ride.status === "declined" ? "warning" : "outline"}>
                    {ride.status === "accepted" ? "Acceptată" : ride.status === "declined" ? "Refuzată" : "Nouă"}
                  </Badge>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  {ride.pickup} → {ride.destination}
                </p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(ride.fare)} · {ride.area}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:w-56">
                <Button type="button" disabled={ride.status === "accepted"} onClick={() => updateRide(ride.id, "accepted")}>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Acceptă
                </Button>
                <Button type="button" variant="outline" disabled={ride.status === "declined"} onClick={() => updateRide(ride.id, "declined")}>
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Refuză
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
