import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerGreeting } from "@/components/customer/CustomerGreeting";
import { CustomerHomeLayout } from "@/components/customer/CustomerHomeLayout";
import { CustomerHomeLowerSection } from "@/components/customer/CustomerHomeLowerSection";
import { CustomerHomeSearchBar } from "@/components/customer/CustomerHomeSearchBar";
import { CustomerNotificationCarousel } from "@/components/customer/CustomerNotificationCarousel";
import { CustomerServiceChoices } from "@/components/customer/CustomerServiceChoices";
import { CustomerSplashScreen } from "@/components/customer/CustomerSplashScreen";
import { useGeolocation } from "@/hooks/useGeolocation";
import { createCurrentLocationSuggestion } from "@/services/geocoding";
import { useAppStore } from "@/store/useAppStore";
import type { AddressSuggestion, RecentLocation, ServiceType } from "@/types/domain";

const splashSessionKey = "customer-splash-seen";

export function CustomerHomePage() {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const profile = useAppStore((state) => state.profile);
  const customerNotifications = useAppStore((state) => state.customerNotifications);
  const dismissedCustomerNotificationIds = useAppStore((state) => state.dismissedCustomerNotificationIds);
  const recentLocations = useAppStore((state) => state.recentLocations);
  const preferredPaymentMethod = useAppStore((state) => state.preferredPaymentMethod);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const dismissCustomerNotification = useAppStore((state) => state.dismissCustomerNotification);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem(splashSessionKey));
  const pickup = useMemo(
    () => createCurrentLocationSuggestion(position.lat, position.lng),
    [position.lat, position.lng]
  );
  const firstName = profile?.fullName?.split(" ")[0] || "Client";
  const visibleNotifications = customerNotifications.filter(
    (notification) => !dismissedCustomerNotificationIds.includes(notification.id)
  );

  useEffect(() => {
    if (!showSplash) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(
      () => {
        sessionStorage.setItem(splashSessionKey, "true");
        setShowSplash(false);
      },
      prefersReducedMotion ? 450 : 1400
    );

    return () => window.clearTimeout(timeout);
  }, [showSplash]);

  const openDropoff = (serviceType: Extract<ServiceType, "standard" | "premium"> = "standard", destination?: AddressSuggestion) => {
    updateBookingDraft({
      pickup,
      destination,
      serviceType,
      paymentMethod: preferredPaymentMethod,
      cashRequired: preferredPaymentMethod === "cash",
      cashStatus: preferredPaymentMethod === "cash" ? "pending_collection" : "not_required",
      currency: "RON"
    });
    navigate("/customer/booking/dropoff");
  };

  const openRoadside = (mode: Extract<ServiceType, "tow" | "roadside">) => {
    updateBookingDraft({
      pickup,
      serviceType: mode,
      paymentMethod: preferredPaymentMethod,
      cashRequired: preferredPaymentMethod === "cash",
      cashStatus: preferredPaymentMethod === "cash" ? "pending_collection" : "not_required",
      currency: "RON"
    });
    navigate(`/customer/roadside?mode=${mode}`);
  };

  const selectRecentLocation = (location: RecentLocation) => {
    openDropoff("standard", {
      id: location.id,
      label: location.label,
      street: location.label,
      city: location.address,
      lat: location.lat,
      lng: location.lng
    });
  };

  if (showSplash) {
    return <CustomerSplashScreen />;
  }

  return (
    <CustomerHomeLayout>
      <CustomerNotificationCarousel
        notifications={visibleNotifications}
        onDismiss={dismissCustomerNotification}
        onAction={navigate}
      />
      <CustomerGreeting firstName={firstName} />
      <CustomerServiceChoices
        onSelectRide={openDropoff}
        onSelectTow={() => openRoadside("tow")}
        onSelectRoadside={() => openRoadside("roadside")}
      />
      <CustomerHomeSearchBar onClick={() => openDropoff()} />
      <CustomerHomeLowerSection
        recentLocations={recentLocations}
        position={position}
        onRecentLocationSelect={selectRecentLocation}
        onUseCurrentLocation={() => openDropoff()}
      />
    </CustomerHomeLayout>
  );
}
