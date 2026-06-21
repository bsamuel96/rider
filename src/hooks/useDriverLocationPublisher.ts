import { useEffect } from "react";
import { upsertDriverAvailability } from "@/services/driver";
import { shouldPublishDriverLocation } from "@/services/driverWorkflow";
import { useAppStore } from "@/store/useAppStore";
import type { Coordinates, DriverWorkflowStatus } from "@/types/domain";

type UseDriverLocationPublisherArgs = {
  status: DriverWorkflowStatus;
  currentLocation: Coordinates;
  shiftStartedAt?: string;
};

export function useDriverLocationPublisher({ status, currentLocation, shiftStartedAt }: UseDriverLocationPublisherArgs) {
  const profile = useAppStore((state) => state.profile);

  useEffect(() => {
    if (!profile?.id || !shouldPublishDriverLocation(status)) {
      return undefined;
    }

    const publish = () => {
      void upsertDriverAvailability({
        driverId: profile.id,
        status,
        online: status !== "offline",
        currentLocation,
        shiftStartedAt
      });
    };

    publish();
    const interval = window.setInterval(publish, 10000);

    return () => window.clearInterval(interval);
  }, [currentLocation, profile?.id, shiftStartedAt, status]);
}
