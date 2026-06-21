import { useCallback, useEffect, useState } from "react";
import type { Coordinates, DriverRideOffer, PaymentMethod, ServiceType } from "@/types/domain";
import { estimateEtaMinutes, haversineDistanceKm } from "@/utils/geo";

const OFFER_DELAY_MS = 1600;
const OFFER_TTL_SECONDS = 20;

type UseDriverRideOffersArgs = {
  enabled: boolean;
  driverLocation: Coordinates;
  onExpired?: () => void;
};

const demoRoutes: Array<{
  customerName: string;
  customerRating: number;
  pickupAddress: string;
  destinationAddress: string;
  serviceType: ServiceType;
  paymentMethod: PaymentMethod;
  fareEstimate: number;
  pickupOffset: Coordinates;
  destinationOffset: Coordinates;
}> = [
  {
    customerName: "Andreea M.",
    customerRating: 4.91,
    pickupAddress: "Piața Victoriei",
    destinationAddress: "Aeroport Otopeni",
    serviceType: "standard",
    paymentMethod: "cash",
    fareEstimate: 58,
    pickupOffset: { lat: 0.012, lng: -0.009 },
    destinationOffset: { lat: 0.05, lng: 0.024 }
  },
  {
    customerName: "Mihai P.",
    customerRating: 4.84,
    pickupAddress: "Universitate",
    destinationAddress: "Băneasa Shopping City",
    serviceType: "premium",
    paymentMethod: "card",
    fareEstimate: 72,
    pickupOffset: { lat: -0.01, lng: 0.012 },
    destinationOffset: { lat: 0.034, lng: -0.018 }
  }
];

export function createDemoDriverOffer(driverLocation: Coordinates, sequence = 0): DriverRideOffer {
  const route = demoRoutes[sequence % demoRoutes.length];
  const pickup = {
    lat: driverLocation.lat + route.pickupOffset.lat,
    lng: driverLocation.lng + route.pickupOffset.lng
  };
  const destination = {
    lat: driverLocation.lat + route.destinationOffset.lat,
    lng: driverLocation.lng + route.destinationOffset.lng
  };
  const distanceToPickupKm = haversineDistanceKm(driverLocation, pickup);
  const routeDistanceKm = haversineDistanceKm(pickup, destination);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + OFFER_TTL_SECONDS * 1000);

  return {
    id: `offer-${sequence + 1}`,
    bookingId: `booking-${sequence + 1}`,
    customerName: route.customerName,
    customerRating: route.customerRating,
    pickupAddress: route.pickupAddress,
    destinationAddress: route.destinationAddress,
    pickup,
    destination,
    serviceType: route.serviceType,
    paymentMethod: route.paymentMethod,
    fareEstimate: route.fareEstimate,
    currency: "RON",
    distanceToPickupKm,
    routeDistanceKm,
    etaToPickupMinutes: estimateEtaMinutes(distanceToPickupKm, "driver_to_pickup"),
    etaToDestinationMinutes: estimateEtaMinutes(routeDistanceKm, "active_ride"),
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: "pending"
  };
}

export function useDriverRideOffers({ enabled, driverLocation, onExpired }: UseDriverRideOffersArgs) {
  const [activeOffer, setActiveOffer] = useState<DriverRideOffer | null>(null);
  const [offerSequence, setOfferSequence] = useState(0);
  const [offerCountdownSeconds, setOfferCountdownSeconds] = useState(OFFER_TTL_SECONDS);

  useEffect(() => {
    if (!enabled || activeOffer) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActiveOffer(createDemoDriverOffer(driverLocation, offerSequence));
      setOfferCountdownSeconds(OFFER_TTL_SECONDS);
      setOfferSequence((current) => current + 1);
    }, OFFER_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [activeOffer, driverLocation, enabled, offerSequence]);

  useEffect(() => {
    if (!activeOffer || activeOffer.status !== "pending") {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((new Date(activeOffer.expiresAt).getTime() - Date.now()) / 1000));
      setOfferCountdownSeconds(remaining);

      if (remaining === 0) {
        setActiveOffer(null);
        onExpired?.();
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [activeOffer, onExpired]);

  const acceptOffer = useCallback(() => {
    setActiveOffer((current) => (current ? { ...current, status: "accepted" } : current));
  }, []);

  const rejectOffer = useCallback(() => {
    setActiveOffer(null);
  }, []);

  const clearOffer = useCallback(() => {
    setActiveOffer(null);
  }, []);

  return {
    activeOffer,
    offerCountdownSeconds,
    acceptOffer,
    rejectOffer,
    clearOffer
  };
}
