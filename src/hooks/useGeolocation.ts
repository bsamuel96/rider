import { useEffect, useState } from "react";
import type { Coordinates } from "@/types/domain";
import { DEFAULT_CENTER } from "@/utils/constants";

export function useGeolocation() {
  const [position, setPosition] = useState<Coordinates>(DEFAULT_CENTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (nextPosition) => {
        setPosition({
          lat: nextPosition.coords.latitude,
          lng: nextPosition.coords.longitude
        });
        setLoading(false);
      },
      () => {
        setPosition(DEFAULT_CENTER);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 8000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return {
    position,
    loading
  };
}
