import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { DriverCustomerRatingPanel } from "@/components/driver/DriverCustomerRatingPanel";
import type { DriverActiveBooking, RatingDraft } from "@/types/domain";

type DriverRatingSheetProps = {
  booking: DriverActiveBooking;
  onSubmit: (rating: RatingDraft) => void;
};

export function DriverRatingSheet({ booking, onSubmit }: DriverRatingSheetProps) {
  return (
    <MapFloatingPanel>
      <DriverCustomerRatingPanel customerName={booking.customerName} onSubmit={onSubmit} />
    </MapFloatingPanel>
  );
}
