import { CalendarDays, ChevronRight, Filter, MapPin, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

const rides = [
  {
    id: "ride-1001",
    status: "Finalizată",
    payment: "Cash",
    fare: 58,
    time: "Azi, 14:20",
    pickup: "Piața Victoriei",
    destination: "Aeroport Otopeni",
    tone: "success"
  },
  {
    id: "ride-1002",
    status: "Finalizată",
    payment: "Card",
    fare: 42,
    time: "Azi, 12:05",
    pickup: "Unirii",
    destination: "Pipera",
    tone: "success"
  },
  {
    id: "ride-1003",
    status: "Respinsă",
    payment: "Card",
    fare: 0,
    time: "Ieri, 20:14",
    pickup: "Tineretului",
    destination: "Băneasa",
    tone: "warning"
  },
  {
    id: "ride-1004",
    status: "Anulată",
    payment: "Cash",
    fare: 12,
    time: "Ieri, 18:02",
    pickup: "Universitate",
    destination: "Cotroceni",
    tone: "error"
  }
] as const;

const filters = ["Sortează", "Data", "Status", "Plată"];

export function DriverRidesPage() {
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Curse</p>
        <h1 className="mt-1 text-2xl font-semibold">Istoric curse</h1>
        <p className="mt-1 text-sm text-muted-foreground">Curse finalizate, respinse, anulate, plăți și detalii suport.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() =>
              toast({
                title: `Filtru: ${filter}`,
                description: "Demo: filtrul a fost aplicat vizual.",
                tone: "default"
              })
            }
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-border/60 bg-background px-4 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {filter === "Sortează" ? <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> : <Filter className="h-4 w-4" aria-hidden="true" />}
            {filter}
          </button>
        ))}
      </div>

      <section className="grid gap-3">
        {rides.map((ride) => (
          <Link
            key={ride.id}
            to={`/driver/ride/${ride.id}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="p-4 transition-colors hover:bg-muted/55">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={ride.tone === "warning" ? "warning" : "secondary"}
                      className={cn(
                        ride.tone === "success" && "bg-primary/12 text-primary",
                        ride.tone === "error" && "bg-destructive/12 text-destructive"
                      )}
                    >
                      {ride.status}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {ride.time}
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="truncate">
                      {ride.pickup} → {ride.destination}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{ride.payment} · {formatCurrency(ride.fare)}</p>
                </div>
                <span className="flex shrink-0 items-center gap-2 font-semibold">
                  {formatCurrency(ride.fare)}
                  <ChevronRight className={cn("h-4 w-4 text-muted-foreground")} aria-hidden="true" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
