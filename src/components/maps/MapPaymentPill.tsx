import { MapPaymentChip } from "@/components/maps/MapPaymentChip";
import type { PaymentMethod } from "@/types/domain";

type MapPaymentPillProps = {
  paymentMethod?: PaymentMethod;
  fareEstimate?: number;
  cashEnabled?: boolean;
  onClick?: () => void;
};

export function MapPaymentPill(props: MapPaymentPillProps) {
  return <MapPaymentChip {...props} />;
}
