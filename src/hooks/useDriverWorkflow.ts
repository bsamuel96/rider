import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  markDriverCashCollected,
  respondToDriverOffer,
  updateDriverWorkflowStatus,
  upsertDriverAvailability
} from "@/services/driver";
import {
  canTransitionDriverStatus,
  getDriverPrimaryAction,
  getDriverSecondaryActions,
  shouldPublishDriverLocation
} from "@/services/driverWorkflow";
import { useAppStore } from "@/store/useAppStore";
import type {
  CashStatus,
  Coordinates,
  DriverActiveBooking,
  DriverRideOffer,
  DriverWorkflowStatus,
  RatingDraft
} from "@/types/domain";
import { estimateEtaMinutes, haversineDistanceKm } from "@/utils/geo";
import { useDriverActiveBooking } from "./useDriverActiveBooking";
import { useDriverLocationPublisher } from "./useDriverLocationPublisher";
import { useDriverRideOffers } from "./useDriverRideOffers";
import { useDriverShift } from "./useDriverShift";
import { useGeolocation } from "./useGeolocation";

type DriverBookingSeed = Omit<DriverRideOffer, "status"> & {
  acceptedAt?: string;
};

function toBookingSeed(offer: DriverRideOffer): DriverBookingSeed {
  return {
    id: offer.id,
    bookingId: offer.bookingId,
    customerName: offer.customerName,
    customerRating: offer.customerRating,
    pickupAddress: offer.pickupAddress,
    destinationAddress: offer.destinationAddress,
    pickup: offer.pickup,
    destination: offer.destination,
    serviceType: offer.serviceType,
    paymentMethod: offer.paymentMethod,
    fareEstimate: offer.fareEstimate,
    currency: offer.currency,
    distanceToPickupKm: offer.distanceToPickupKm,
    routeDistanceKm: offer.routeDistanceKm,
    etaToPickupMinutes: offer.etaToPickupMinutes,
    etaToDestinationMinutes: offer.etaToDestinationMinutes,
    createdAt: offer.createdAt,
    expiresAt: offer.expiresAt
  };
}

function interpolateLocation(from: Coordinates, to: Coordinates, progress: number): Coordinates {
  return {
    lat: from.lat + (to.lat - from.lat) * progress,
    lng: from.lng + (to.lng - from.lng) * progress
  };
}

export function useDriverWorkflow() {
  const profile = useAppStore((state) => state.profile);
  const { position, loading } = useGeolocation();
  const [status, setStatus] = useState<DriverWorkflowStatus>("offline");
  const [bookingOffer, setBookingOffer] = useState<DriverBookingSeed | null>(null);
  const [cashStatus, setCashStatus] = useState<CashStatus>("pending_collection");
  const [shiftStartedAt, setShiftStartedAt] = useState<string | undefined>();
  const recordedBookingIdsRef = useRef(new Set<string>());
  const { summary, ledger, todayEarnings, recordCompletedRide, addOnlineMinute } = useDriverShift();

  const handleOfferExpired = useCallback(() => {
    setStatus((current) => (current === "offer_received" ? "available" : current));
  }, []);

  const { activeOffer, offerCountdownSeconds, acceptOffer: acceptPendingOffer, rejectOffer: clearPendingOffer, clearOffer } =
    useDriverRideOffers({
      enabled: status === "available",
      driverLocation: position,
      onExpired: handleOfferExpired
    });

  useEffect(() => {
    if (status === "available" && activeOffer) {
      setStatus("offer_received");
    }
  }, [activeOffer, status]);

  const activeBooking = useDriverActiveBooking(bookingOffer, status, cashStatus);
  const activePaymentMethod = activeBooking?.paymentMethod ?? activeOffer?.paymentMethod ?? "cash";
  const activeServiceType = activeBooking?.serviceType ?? activeOffer?.serviceType ?? "standard";

  const driverLocation = useMemo(() => {
    if (!activeBooking) {
      return position;
    }

    if (["arrived_at_pickup", "waiting_for_customer", "trip_started"].includes(status)) {
      return activeBooking.pickup;
    }

    if (status === "en_route_to_destination") {
      return interpolateLocation(activeBooking.pickup, activeBooking.destination, 0.52);
    }

    if (["arrived_at_destination", "trip_completed", "cash_collection_required", "cash_collected", "rating_customer"].includes(status)) {
      return activeBooking.destination;
    }

    return position;
  }, [activeBooking, position, status]);

  const pickupLocation = activeBooking?.pickup ?? activeOffer?.pickup;
  const destinationLocation = activeBooking?.destination ?? activeOffer?.destination;
  const distanceToPickupKm = pickupLocation ? haversineDistanceKm(driverLocation, pickupLocation) : undefined;
  const distanceToDestinationKm =
    destinationLocation && pickupLocation ? haversineDistanceKm(driverLocation, destinationLocation) : undefined;
  const etaToPickupMinutes =
    distanceToPickupKm !== undefined ? estimateEtaMinutes(distanceToPickupKm, "driver_to_pickup") : undefined;
  const etaToDestinationMinutes =
    distanceToDestinationKm !== undefined ? estimateEtaMinutes(distanceToDestinationKm, "active_ride") : undefined;

  useDriverLocationPublisher({
    status,
    currentLocation: driverLocation,
    shiftStartedAt
  });

  useEffect(() => {
    if (!shouldPublishDriverLocation(status)) {
      return undefined;
    }

    const interval = window.setInterval(addOnlineMinute, 60000);
    return () => window.clearInterval(interval);
  }, [addOnlineMinute, status]);

  const recordEarning = useCallback(
    (booking: DriverActiveBooking | null) => {
      if (!booking || recordedBookingIdsRef.current.has(booking.bookingId)) {
        return;
      }

      recordedBookingIdsRef.current.add(booking.bookingId);
      recordCompletedRide({
        bookingId: booking.bookingId,
        label: `${booking.pickupAddress} → ${booking.destinationAddress}`,
        amount: booking.fareEstimate,
        paymentMethod: booking.paymentMethod
      });
    },
    [recordCompletedRide]
  );

  const transitionTo = useCallback(
    (nextStatus: DriverWorkflowStatus, options: { cancellationReason?: string } = {}) => {
      if (!canTransitionDriverStatus(status, nextStatus, activePaymentMethod)) {
        return false;
      }

      setStatus(nextStatus);
      if (activeBooking?.bookingId) {
        void updateDriverWorkflowStatus(activeBooking.bookingId, nextStatus, {
          cancellationReason: options.cancellationReason
        });
      }

      return true;
    },
    [activeBooking?.bookingId, activePaymentMethod, status]
  );

  const goOnline = useCallback(() => {
    if (status === "offline") {
      const startedAt = new Date().toISOString();
      setShiftStartedAt(startedAt);
      setStatus("preflight");
      return;
    }

    if (status === "preflight") {
      setStatus("available");
    }
  }, [status]);

  const goOffline = useCallback(() => {
    if (profile?.id) {
      void upsertDriverAvailability({
        driverId: profile.id,
        status: "offline",
        online: false,
        currentLocation: position,
        shiftStartedAt
      });
    }

    setStatus("offline");
    setBookingOffer(null);
    clearOffer();
  }, [clearOffer, position, profile?.id, shiftStartedAt]);

  const acceptOffer = useCallback(() => {
    if (!activeOffer) {
      return;
    }

    acceptPendingOffer();
    setCashStatus(activeOffer.paymentMethod === "cash" ? "pending_collection" : "not_required");
    setBookingOffer({
      ...toBookingSeed(activeOffer),
      acceptedAt: new Date().toISOString()
    });
    setStatus("offer_accepted");
    clearOffer();
    void respondToDriverOffer(activeOffer.id, "accepted");
    void updateDriverWorkflowStatus(activeOffer.bookingId, "offer_accepted");
  }, [acceptPendingOffer, activeOffer, clearOffer]);

  const rejectOffer = useCallback(() => {
    if (activeOffer) {
      void respondToDriverOffer(activeOffer.id, "rejected");
    }

    clearPendingOffer();
    setStatus("available");
  }, [activeOffer, clearPendingOffer]);

  const markEnRouteToPickup = useCallback(() => {
    transitionTo("en_route_to_pickup");
  }, [transitionTo]);

  const markArrivedAtPickup = useCallback(() => {
    transitionTo("arrived_at_pickup");
  }, [transitionTo]);

  const markWaitingForCustomer = useCallback(() => {
    transitionTo("waiting_for_customer");
  }, [transitionTo]);

  const startTrip = useCallback(() => {
    transitionTo("trip_started");
  }, [transitionTo]);

  const markEnRouteToDestination = useCallback(() => {
    transitionTo("en_route_to_destination");
  }, [transitionTo]);

  const markArrivedAtDestination = useCallback(() => {
    transitionTo("arrived_at_destination");
  }, [transitionTo]);

  const completeTrip = useCallback(() => {
    const booking = activeBooking;
    if (!transitionTo("trip_completed")) {
      return;
    }

    if (booking?.paymentMethod === "card") {
      recordEarning(booking);
    }
  }, [activeBooking, recordEarning, transitionTo]);

  const requestCashCollection = useCallback(() => {
    transitionTo("cash_collection_required");
  }, [transitionTo]);

  const markCashCollected = useCallback(() => {
    if (activeBooking && profile?.id) {
      void markDriverCashCollected(profile.id, activeBooking.bookingId, activeBooking.fareEstimate);
    }

    recordEarning(activeBooking);
    setCashStatus("collected");
    transitionTo("cash_collected");
  }, [activeBooking, profile?.id, recordEarning, transitionTo]);

  const moveToRating = useCallback(() => {
    transitionTo("rating_customer");
  }, [transitionTo]);

  const rateCustomer = useCallback((rating?: RatingDraft) => {
    if (rating) {
      void rating;
    }

    setStatus("available");
    setBookingOffer(null);
    setCashStatus("pending_collection");
  }, []);

  const cancelRide = useCallback(
    (reason = "Anulat de șofer") => {
      if (activeBooking?.bookingId) {
        void updateDriverWorkflowStatus(activeBooking.bookingId, "available", {
          cancellationReason: reason
        });
      }

      setBookingOffer(null);
      setCashStatus("pending_collection");
      setStatus("available");
    },
    [activeBooking?.bookingId]
  );

  const performPrimaryAction = useCallback(() => {
    if (status === "offline" || status === "preflight") {
      goOnline();
      return;
    }

    if (status === "offer_received") {
      acceptOffer();
      return;
    }

    if (status === "offer_accepted") {
      markEnRouteToPickup();
      return;
    }

    if (status === "en_route_to_pickup") {
      markArrivedAtPickup();
      return;
    }

    if (status === "arrived_at_pickup") {
      markWaitingForCustomer();
      return;
    }

    if (status === "waiting_for_customer") {
      startTrip();
      return;
    }

    if (status === "trip_started") {
      markEnRouteToDestination();
      return;
    }

    if (status === "en_route_to_destination") {
      markArrivedAtDestination();
      return;
    }

    if (status === "arrived_at_destination") {
      completeTrip();
      return;
    }

    if (status === "trip_completed") {
      if (activePaymentMethod === "cash") {
        requestCashCollection();
        return;
      }

      moveToRating();
      return;
    }

    if (status === "cash_collection_required") {
      markCashCollected();
      return;
    }

    if (status === "cash_collected") {
      moveToRating();
      return;
    }

    if (status === "rating_customer") {
      rateCustomer();
    }
  }, [
    acceptOffer,
    activePaymentMethod,
    completeTrip,
    goOnline,
    markArrivedAtDestination,
    markArrivedAtPickup,
    markCashCollected,
    markEnRouteToDestination,
    markEnRouteToPickup,
    markWaitingForCustomer,
    moveToRating,
    rateCustomer,
    requestCashCollection,
    startTrip,
    status
  ]);

  return {
    status,
    activeBooking,
    activeOffer,
    locations: {
      driver: driverLocation,
      pickup: pickupLocation,
      destination: destinationLocation
    },
    distances: {
      toPickupKm: distanceToPickupKm,
      toDestinationKm: distanceToDestinationKm
    },
    etas: {
      toPickupMinutes: etaToPickupMinutes,
      toDestinationMinutes: etaToDestinationMinutes
    },
    payment: {
      method: activePaymentMethod,
      fare: activeBooking?.fareEstimate ?? activeOffer?.fareEstimate ?? 0,
      currency: "RON" as const
    },
    fare: activeBooking?.fareEstimate ?? activeOffer?.fareEstimate ?? 0,
    cashStatus,
    todayEarnings,
    rating: 4.96,
    online: status !== "offline",
    loading,
    primaryAction: getDriverPrimaryAction(status, {
      paymentMethod: activePaymentMethod,
      serviceType: activeServiceType
    }),
    secondaryActions: getDriverSecondaryActions(status),
    offerCountdownSeconds,
    shiftSummary: summary,
    earningsLedger: ledger,
    goOnline,
    goOffline,
    acceptOffer,
    rejectOffer,
    markEnRouteToPickup,
    markArrivedAtPickup,
    markWaitingForCustomer,
    startTrip,
    markEnRouteToDestination,
    markArrivedAtDestination,
    completeTrip,
    markCashCollected,
    rateCustomer,
    cancelRide,
    performPrimaryAction
  };
}
