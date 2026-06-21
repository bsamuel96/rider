import { useEffect, useMemo, useState } from "react";
import { shouldApplyFastGuarantee } from "@/services/roadsidePricing";
import type { RoadsideSpeedTier } from "@/types/domain";

export type RoadsideGuaranteeStatus = "inactive" | "active" | "applied" | "satisfied" | "expired_pending_apply";

type UseRoadsideGuaranteeArgs = {
  speedTier: RoadsideSpeedTier;
  deadline?: string;
  customerConfirmedArrivedAt?: string;
  fastGuaranteeApplied?: boolean;
};

export function useRoadsideGuarantee({
  speedTier,
  deadline,
  customerConfirmedArrivedAt,
  fastGuaranteeApplied
}: UseRoadsideGuaranteeArgs) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (speedTier !== "fast" || !deadline || customerConfirmedArrivedAt || fastGuaranteeApplied) {
      return undefined;
    }

    const interval = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(interval);
  }, [customerConfirmedArrivedAt, deadline, fastGuaranteeApplied, speedTier]);

  return useMemo(() => {
    if (speedTier !== "fast" || !deadline) {
      return {
        status: "inactive" as RoadsideGuaranteeStatus,
        remainingMs: 0,
        remainingMinutes: 0
      };
    }

    if (fastGuaranteeApplied) {
      return {
        status: "applied" as RoadsideGuaranteeStatus,
        remainingMs: 0,
        remainingMinutes: 0
      };
    }

    const remainingMs = Math.max(0, new Date(deadline).getTime() - now.getTime());

    if (customerConfirmedArrivedAt) {
      return {
        status: "satisfied" as RoadsideGuaranteeStatus,
        remainingMs,
        remainingMinutes: Math.ceil(remainingMs / 60000)
      };
    }

    if (
      shouldApplyFastGuarantee({
        speedTier,
        deadline,
        customerConfirmedArrivedAt,
        now
      })
    ) {
      return {
        status: "expired_pending_apply" as RoadsideGuaranteeStatus,
        remainingMs: 0,
        remainingMinutes: 0
      };
    }

    return {
      status: "active" as RoadsideGuaranteeStatus,
      remainingMs,
      remainingMinutes: Math.ceil(remainingMs / 60000)
    };
  }, [customerConfirmedArrivedAt, deadline, fastGuaranteeApplied, now, speedTier]);
}
