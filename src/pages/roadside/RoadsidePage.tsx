import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { RoadsideForm, type RoadsideFormValues } from "@/components/roadside/RoadsideForm";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapBottomSheet } from "@/components/maps/MapBottomSheet";
import { MapStatusPill } from "@/components/maps/MapStatusPill";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppStore } from "@/store/useAppStore";
import type { Coordinates } from "@/types/domain";
import { haversineDistanceKm, estimateEtaMinutes } from "@/utils/geo";

export function RoadsidePage() {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const pushNotification = useAppStore((state) => state.pushNotification);
  const roadsideLocation = useMemo<Coordinates>(
    () => ({
      lat: position.lat + 0.018,
      lng: position.lng - 0.014
    }),
    [position.lat, position.lng]
  );
  const distanceToOperatorKm = haversineDistanceKm(roadsideLocation, position);
  const etaToOperatorMinutes = estimateEtaMinutes(distanceToOperatorKm, "roadside_to_pickup");

  const submit = (values: RoadsideFormValues) => {
    pushNotification({
      id: crypto.randomUUID(),
      title: "Intervenție pornită",
      body: `Operatorul a primit solicitarea: ${values.issueType}.`,
      read: false,
      createdAt: new Date().toISOString()
    });
    navigate("/customer/tracking/roadside-demo");
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        portalLabel="Roadside"
        activeRole="customer"
        serviceType="roadside"
        status="online"
        userLocation={position}
        pickupLocation={position}
        roadsideLocation={roadsideLocation}
        etaToPickupMinutes={etaToOperatorMinutes}
        distanceToPickupKm={distanceToOperatorKm}
        paymentMethod="cash"
        cashEnabled
        fareEstimate={95}
        rating={4.92}
        showBottomControls={false}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <MapBottomSheet className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-[540] max-h-[min(62svh,560px)] overflow-y-auto md:inset-x-auto md:bottom-5 md:left-5 md:w-[420px] md:rounded-3xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Asistență rutieră</p>
              <p className="text-xs text-muted-foreground">Trimite poziția și problema către operator.</p>
            </div>
          </div>
          <MapStatusPill label={`~${etaToOperatorMinutes} min`} tone="success" />
        </div>
        <RoadsideForm onSubmit={submit} />
      </MapBottomSheet>
    </MapFirstPage>
  );
}
