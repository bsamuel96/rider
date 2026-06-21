import { useMemo } from "react";
import type { CashStatus, DriverActiveBooking, DriverRideOffer, DriverWorkflowStatus } from "@/types/domain";

export function useDriverActiveBooking(
  offer: Omit<DriverRideOffer, "status"> | null,
  status: DriverWorkflowStatus,
  cashStatus: CashStatus
): DriverActiveBooking | null {
  return useMemo(() => {
    if (!offer) {
      return null;
    }

    return {
      ...offer,
      status,
      cashStatus
    };
  }, [cashStatus, offer, status]);
}
