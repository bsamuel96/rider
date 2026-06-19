import type { BookingDraft, ServiceType } from "@/types/domain";
import { SERVICE_OPTIONS } from "@/utils/constants";
import { haversineDistanceKm } from "@/utils/format";

const SERVICE_MULTIPLIER: Record<ServiceType, number> = {
  standard: 2.15,
  premium: 3.65,
  tow: 5.25,
  roadside: 2.8
};

export function calculateBookingEstimate(draft: BookingDraft): BookingDraft {
  if (!draft.pickup || !draft.destination || !draft.serviceType) {
    return draft;
  }

  const distanceKm = haversineDistanceKm(draft.pickup, draft.destination);
  const durationMinutes = Math.max(5, Math.round((distanceKm / 28) * 60));
  const option = SERVICE_OPTIONS.find((item) => item.type === draft.serviceType);
  const basePrice = option?.basePrice || 9;
  const price = Math.round(basePrice + distanceKm * SERVICE_MULTIPLIER[draft.serviceType] + durationMinutes * 0.18);

  return {
    ...draft,
    distanceKm,
    durationMinutes,
    price
  };
}
