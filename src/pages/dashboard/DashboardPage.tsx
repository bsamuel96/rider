import { ArrowRight, Car, MapPin, Moon, ShieldCheck, Sparkles, Truck, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { MobilityMap } from "@/components/maps/MobilityMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppStore } from "@/store/useAppStore";

const quickActions = [
  { label: "Standard", icon: Car, path: "/booking" },
  { label: "Premium", icon: Sparkles, path: "/booking" },
  { label: "Tractare", icon: Truck, path: "/roadside" },
  { label: "Asistență", icon: Wrench, path: "/roadside" }
];

export function DashboardPage() {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);
  const bookingDraft = useAppStore((state) => state.bookingDraft);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const { position } = useGeolocation();

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary">Disponibil acum</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-normal sm:text-3xl">
              Salut{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}.
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Curse, tractări și intervenții rutiere în aceeași aplicație.</p>
          </div>
          <div className="hidden h-12 w-12 place-items-center rounded-lg bg-secondary md:grid">
            <Moon className="h-5 w-5" />
          </div>
        </div>

        <Card className="p-5">
          <div className="space-y-4">
            <AddressSearch
              label="Adresă pickup"
              placeholder="Unde ești acum?"
              currentLat={position.lat}
              currentLng={position.lng}
              value={bookingDraft.pickup}
              onSelect={(pickup) => updateBookingDraft({ pickup })}
            />

            <button
              type="button"
              onClick={() => navigate("/booking")}
              className="flex min-h-24 w-full items-center justify-between gap-4 rounded-lg border bg-background p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>
                <span className="block text-lg font-semibold">Unde dorești să mergi?</span>
                <span className="mt-1 block text-sm text-muted-foreground">Alege destinația și confirmă cursa în maximum 3 acțiuni.</span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <button
              type="button"
              key={action.label}
              onClick={() => navigate(action.path)}
              className="grid h-24 place-items-center rounded-lg border bg-card p-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <action.icon className="h-5 w-5" />
              {action.label}
            </button>
          ))}
        </div>
      </section>

      <aside className="space-y-5">
        <MobilityMap pickup={bookingDraft.pickup || position} destination={bookingDraft.destination} />
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">Roadside rapid</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pentru pană, baterie, accident sau combustibil, operatorul vede poziția ta în timp real.</p>
              <Button className="mt-4" variant="outline" onClick={() => navigate("/roadside")}>
                <MapPin className="h-4 w-4" />
                Solicită ajutor
              </Button>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
