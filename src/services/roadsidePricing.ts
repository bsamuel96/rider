import type { RoadsideRequest, RoadsideSpeedTier } from "@/types/domain";

export function calculateRoadsidePrice({
  basePrice,
  speedTier
}: {
  basePrice: number;
  speedTier: RoadsideSpeedTier;
}) {
  const normalPrice = basePrice;
  const fastPrice = Math.round(normalPrice * 1.5);

  return {
    normalPrice,
    fastPrice,
    finalPrice: speedTier === "fast" ? fastPrice : normalPrice
  };
}

export function shouldApplyFastGuarantee({
  speedTier,
  deadline,
  customerConfirmedArrivedAt,
  now = new Date()
}: {
  speedTier: RoadsideSpeedTier;
  deadline?: string;
  customerConfirmedArrivedAt?: string;
  now?: Date;
}) {
  if (speedTier !== "fast" || !deadline || customerConfirmedArrivedAt) {
    return false;
  }

  return now.getTime() > new Date(deadline).getTime();
}

export function applyFastGuarantee(request: RoadsideRequest): RoadsideRequest {
  if (
    !shouldApplyFastGuarantee({
      speedTier: request.speedTier,
      deadline: request.fastGuaranteeDeadline,
      customerConfirmedArrivedAt: request.customerConfirmedArrivedAt
    })
  ) {
    return request;
  }

  return {
    ...request,
    finalPrice: request.normalPrice,
    fastGuaranteeApplied: true
  };
}

export function getFastGuaranteeDeadline(startDate = new Date()) {
  return new Date(startDate.getTime() + 30 * 60 * 1000).toISOString();
}
