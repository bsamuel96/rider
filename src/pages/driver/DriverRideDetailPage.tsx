import { useMemo, useState } from "react";
import { Banknote, FileText, LifeBuoy, MapPin, Phone, ReceiptText, Route } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { createDemoDriverOffer } from "@/hooks/useDriverRideOffers";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { DEFAULT_CENTER } from "@/utils/constants";
import { formatCurrency, formatDistance } from "@/utils/format";

export function DriverRideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const sequence = Math.max(0, Number(id?.replace(/\D/g, "")) - 1 || 0);
  const ride = useMemo(() => createDemoDriverOffer(DEFAULT_CENTER, sequence), [sequence]);
  const commission = Math.round(ride.fareEstimate * 0.18);
  const net = ride.fareEstimate - commission;

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        minimal
        portalLabel="Detaliu cursă"
        activeRole="driver"
        serviceType={ride.serviceType}
        status="completed"
        pickupLocation={ride.pickup}
        destinationLocation={ride.destination}
        driverLocation={DEFAULT_CENTER}
        etaToPickupMinutes={ride.etaToPickupMinutes}
        etaToDestinationMinutes={ride.etaToDestinationMinutes}
        distanceToPickupKm={ride.distanceToPickupKm}
        distanceToDestinationKm={ride.routeDistanceKm}
        paymentMethod={ride.paymentMethod}
        cashEnabled={ride.paymentMethod === "cash"}
        fareEstimate={ride.fareEstimate}
        showTopOverlay={false}
        showBottomOverlay={false}
        showServiceDock={false}
        showPaymentChip={false}
        showMainActions={false}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <MinimizableBottomSheet
        title="Detalii cursă"
        description="Sumar, plată, suport și factură."
        initialState="expanded"
        compactContent={<p className="pb-3 text-sm font-semibold">{ride.pickupAddress} → {ride.destinationAddress}</p>}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Azi, 14:20 · {ride.bookingId}</p>
            <h1 className="mt-1 text-lg font-semibold">{ride.customerName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Status: finalizată · {ride.paymentMethod === "cash" ? "Cash" : "Card"}</p>
          </div>

          <div className="grid gap-2 text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              {ride.pickupAddress}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {ride.destinationAddress}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Route className="h-4 w-4" aria-hidden="true" />
              {formatDistance(ride.routeDistanceKm)} · {ride.etaToDestinationMinutes} min
            </p>
          </div>

          <section className="rounded-2xl bg-muted/60 p-3">
            <h2 className="text-sm font-semibold">Plată și câștig</h2>
            <MoneyRow label="Tarif cursă" value={ride.fareEstimate} />
            <MoneyRow label="Comision" value={-commission} />
            <MoneyRow label="Câștig net" value={net} strong />
          </section>

          <div className="grid gap-2">
            <Button
              type="button"
              onClick={() =>
                toast({
                  title: "Demo: apel către pasager simulat.",
                  description: `${ride.customerName} ar fi apelat prin telefon.`,
                  tone: "success"
                })
              }
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Sună pasagerul
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(`/driver/support/new?ride=${ride.bookingId}`)}>
              <LifeBuoy className="h-4 w-4" aria-hidden="true" />
              Cere ajutor pentru această cursă
            </Button>
            <Button type="button" variant="outline" onClick={() => setInvoiceOpen(true)}>
              <ReceiptText className="h-4 w-4" aria-hidden="true" />
              Obține factura
            </Button>
          </div>
        </div>
      </MinimizableBottomSheet>

      <InvoicePreviewSheet
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        rideLabel={`${ride.pickupAddress} → ${ride.destinationAddress}`}
        amount={ride.fareEstimate}
        commission={commission}
        net={net}
      />
    </MapFirstPage>
  );
}

function MoneyRow({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="mt-2 flex justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Banknote className="h-4 w-4 text-primary" aria-hidden="true" />
        {label}
      </span>
      <span className={strong ? "font-semibold" : undefined}>{formatCurrency(value)}</span>
    </div>
  );
}

function InvoicePreviewSheet({
  open,
  onClose,
  rideLabel,
  amount,
  commission,
  net
}: {
  open: boolean;
  onClose: () => void;
  rideLabel: string;
  amount: number;
  commission: number;
  net: number;
}) {
  if (!open) {
    return null;
  }

  return (
    <MinimizableBottomSheet title="Factură demo" description="Previzualizare document fiscal pentru cursă." initialState="half" dismissible onStateChange={(state) => state === "closed" && onClose()}>
      <div className="space-y-3">
        <div className="rounded-2xl border border-border/60 bg-background p-4">
          <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold">Rider · Factură cursă</p>
          <p className="mt-1 text-xs text-muted-foreground">{rideLabel}</p>
          <MoneyRow label="Total" value={amount} />
          <MoneyRow label="Comision" value={-commission} />
          <MoneyRow label="Net șofer" value={net} strong />
        </div>
        <Button type="button" className="w-full" onClick={onClose}>
          Închide previzualizarea
        </Button>
      </div>
    </MinimizableBottomSheet>
  );
}
