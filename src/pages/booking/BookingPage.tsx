import { CheckCircle2, CreditCard, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { MobilityMap } from "@/components/maps/MobilityMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateBookingEstimate } from "@/services/pricing";
import { useAppStore } from "@/store/useAppStore";
import type { BookingDraft, ServiceType } from "@/types/domain";
import { formatCurrency, formatDistance } from "@/utils/format";

export function BookingPage() {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const bookingDraft = useAppStore((state) => state.bookingDraft);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const pushNotification = useAppStore((state) => state.pushNotification);

  const updateEstimate = (patch: Partial<BookingDraft> = {}) => {
    const estimated = calculateBookingEstimate({
      ...bookingDraft,
      ...patch
    });
    updateBookingDraft(estimated);
  };

  const canConfirm = Boolean(bookingDraft.pickup && bookingDraft.destination && bookingDraft.serviceType);

  const confirm = () => {
    pushNotification({
      id: crypto.randomUUID(),
      title: "Comandă trimisă",
      body: "Căutăm cel mai apropiat șofer disponibil.",
      read: false,
      createdAt: new Date().toISOString()
    });
    navigate("/tracking");
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[420px_1fr]">
      <section className="space-y-5">
        <Card className="p-5">
          <div className="space-y-4">
            <AddressSearch
              label="Pickup"
              placeholder="De unde pleci?"
              currentLat={position.lat}
              currentLng={position.lng}
              value={bookingDraft.pickup}
              onSelect={(pickup) => updateBookingDraft({ pickup })}
            />
            <AddressSearch
              label="Destinație"
              placeholder="Unde dorești să mergi?"
              value={bookingDraft.destination}
              onSelect={(destination) => {
                updateEstimate({ destination });
              }}
            />
          </div>
        </Card>

        {bookingDraft.pickup && bookingDraft.destination && (
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Alege serviciul</h2>
            </div>
            <ServiceSelector
              selected={bookingDraft.serviceType}
              distanceKm={bookingDraft.distanceKm}
              price={bookingDraft.price}
              onSelect={(serviceType: ServiceType) => updateEstimate({ serviceType })}
            />
          </Card>
        )}
      </section>

      <aside className="space-y-5">
        <MobilityMap pickup={bookingDraft.pickup || position} destination={bookingDraft.destination} />

        <Card className="p-5">
          <h2 className="font-semibold">Confirmare</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Pickup</dt>
              <dd className="max-w-[60%] truncate font-medium">{bookingDraft.pickup?.label || "Neales"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Destinație</dt>
              <dd className="max-w-[60%] truncate font-medium">{bookingDraft.destination?.label || "Nealeasă"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Distanță</dt>
              <dd className="font-medium">{formatDistance(bookingDraft.distanceKm)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Durată</dt>
              <dd className="font-medium">{bookingDraft.durationMinutes || 0} min</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cost</dt>
              <dd className="font-semibold">{formatCurrency(bookingDraft.price || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Metodă plată</dt>
              <dd className="inline-flex items-center gap-2 font-medium">
                <CreditCard className="h-4 w-4" />
                Card
              </dd>
            </div>
          </dl>

          <Button className="mt-5 w-full" size="lg" disabled={!canConfirm} onClick={confirm}>
            <CheckCircle2 className="h-4 w-4" />
            Confirmă
          </Button>
        </Card>
      </aside>
    </div>
  );
}
