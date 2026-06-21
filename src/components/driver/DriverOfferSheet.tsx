import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { DriverOfferCard } from "@/components/driver/DriverOfferCard";
import type { DriverRideOffer } from "@/types/domain";

type DriverOfferSheetProps = {
  offer: DriverRideOffer;
  countdownSeconds: number;
  onAccept: () => void;
  onReject: () => void;
};

export function DriverOfferSheet({ offer, countdownSeconds, onAccept, onReject }: DriverOfferSheetProps) {
  return (
    <MapFloatingPanel>
      <DriverOfferCard offer={offer} countdownSeconds={countdownSeconds} onAccept={onAccept} onReject={onReject} />
    </MapFloatingPanel>
  );
}
