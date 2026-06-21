import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { LiveMobilityMap } from "@/components/maps/LiveMobilityMap";
import { MapBottomSheet } from "@/components/maps/MapBottomSheet";
import { MapStatusPill } from "@/components/maps/MapStatusPill";
import { LocationPickerSheet } from "@/components/location/LocationPickerSheet";
import { RoadsideConfirmStep } from "@/components/roadside/RoadsideConfirmStep";
import { RoadsideIssueStep } from "@/components/roadside/RoadsideIssueStep";
import { RoadsideLocationStep } from "@/components/roadside/RoadsideLocationStep";
import { RoadsidePhotoStep } from "@/components/roadside/RoadsidePhotoStep";
import { RoadsideSafetyStep } from "@/components/roadside/RoadsideSafetyStep";
import { RoadsideStepProgress, type RoadsideStep } from "@/components/roadside/RoadsideStepProgress";
import { MapFirstPage } from "@/layouts/MapFirstPage";
import { useGeolocation } from "@/hooks/useGeolocation";
import { usePaymentState } from "@/hooks/usePaymentState";
import { useRoadsideGuarantee } from "@/hooks/useRoadsideGuarantee";
import { createCurrentLocationSuggestion } from "@/services/geocoding";
import { calculateRoadsidePrice, getFastGuaranteeDeadline } from "@/services/roadsidePricing";
import { useAppStore } from "@/store/useAppStore";
import type {
  AddressSuggestion,
  Coordinates,
  RoadsideIssue,
  RoadsideRequestStatus,
  RoadsideSpeedTier,
  ServiceType
} from "@/types/domain";
import { haversineDistanceKm, estimateEtaMinutes } from "@/utils/geo";

export function RoadsidePage() {
  const [searchParams] = useSearchParams();
  const { position } = useGeolocation();
  const payment = usePaymentState();
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const pushNotification = useAppStore((state) => state.pushNotification);
  const routeMode = searchParams.get("mode");
  const mode: Extract<ServiceType, "tow" | "roadside"> = routeMode === "tow" ? "tow" : "roadside";
  const [step, setStep] = useState<RoadsideStep>("location");
  const [issueType, setIssueType] = useState<RoadsideIssue>(mode === "tow" ? "engine" : "flat_tire");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | undefined>();
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RoadsideRequestStatus>("draft");
  const [speedTier, setSpeedTier] = useState<RoadsideSpeedTier>("normal");
  const [fastGuaranteeDeadline, setFastGuaranteeDeadline] = useState<string | undefined>();
  const [fastGuaranteeApplied, setFastGuaranteeApplied] = useState(false);
  const [customerConfirmedArrivedAt, setCustomerConfirmedArrivedAt] = useState<string | undefined>();
  const [vehicleType, setVehicleType] = useState("");
  const [towDestination, setTowDestination] = useState("");
  const [canRoll, setCanRoll] = useState(false);
  const [safePlace, setSafePlace] = useState(true);
  const currentGpsAddress = useMemo(() => createCurrentLocationSuggestion(position.lat, position.lng), [position.lat, position.lng]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | undefined>();
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const currentAddress = selectedAddress || currentGpsAddress;
  const roadsideLocation = useMemo<Coordinates>(
    () => ({
      lat: position.lat + 0.018,
      lng: position.lng - 0.014
    }),
    [position.lat, position.lng]
  );
  const distanceToOperatorKm = haversineDistanceKm(roadsideLocation, currentAddress);
  const etaToOperatorMinutes = estimateEtaMinutes(distanceToOperatorKm, mode === "tow" ? "tow_to_pickup" : "roadside_to_pickup");
  const basePrice = mode === "tow" ? 180 : 95;
  const roadsidePrice = calculateRoadsidePrice({
    basePrice,
    speedTier
  });
  const guarantee = useRoadsideGuarantee({
    speedTier,
    deadline: fastGuaranteeDeadline,
    customerConfirmedArrivedAt,
    fastGuaranteeApplied
  });
  const fareEstimate = fastGuaranteeApplied ? roadsidePrice.normalPrice : roadsidePrice.finalPrice;

  useEffect(() => {
    if (!submitted || requestStatus !== "operator_en_route") {
      return undefined;
    }

    const timer = window.setTimeout(() => setRequestStatus("operator_arrived_pending_customer"), 2500);
    return () => window.clearTimeout(timer);
  }, [requestStatus, submitted]);

  useEffect(() => {
    if (!submitted || requestStatus !== "operator_arrived_confirmed") {
      return undefined;
    }

    const timer = window.setTimeout(() => setRequestStatus("issue_in_progress"), 1000);
    return () => window.clearTimeout(timer);
  }, [requestStatus, submitted]);

  useEffect(() => {
    if (!submitted || requestStatus !== "issue_in_progress") {
      return undefined;
    }

    const timer = window.setTimeout(() => setRequestStatus("issue_solved_pending_customer"), 2500);
    return () => window.clearTimeout(timer);
  }, [requestStatus, submitted]);

  useEffect(() => {
    if (guarantee.status === "expired_pending_apply") {
      setFastGuaranteeApplied(true);
      updateBookingDraft({
        fareEstimate: roadsidePrice.normalPrice,
        price: roadsidePrice.normalPrice,
        roadsideFinalPrice: roadsidePrice.normalPrice,
        roadsideFastGuaranteeApplied: true
      });
    }
  }, [guarantee.status, roadsidePrice.normalPrice, updateBookingDraft]);

  const persistLocation = (address = currentAddress) => {
    updateBookingDraft({
      pickup: address,
      serviceType: mode,
      paymentMethod: payment.paymentMethod,
      cashRequired: payment.isCash,
      cashStatus: payment.isCash ? "pending_collection" : "not_required",
      fareEstimate,
      currency: "RON"
    });
  };

  const useCurrentLocation = () => {
    setSelectedAddress(currentGpsAddress);
    persistLocation(currentGpsAddress);
  };

  const submit = () => {
    const acceptedAt = new Date();
    const guaranteeDeadline = speedTier === "fast" ? getFastGuaranteeDeadline(acceptedAt) : undefined;
    updateBookingDraft({
      pickup: currentAddress,
      serviceType: mode,
      paymentMethod: payment.paymentMethod,
      cashRequired: payment.isCash,
      cashStatus: payment.isCash ? "pending_collection" : "not_required",
      fareEstimate,
      price: fareEstimate,
      roadsideSpeedTier: speedTier,
      roadsideNormalPrice: roadsidePrice.normalPrice,
      roadsideFastPrice: roadsidePrice.fastPrice,
      roadsideFinalPrice: fareEstimate,
      roadsideFastGuaranteeDeadline: guaranteeDeadline,
      roadsideFastGuaranteeApplied: false,
      currency: "RON"
    });
    pushNotification({
      id: crypto.randomUUID(),
      title: mode === "tow" ? "Platformă pornită" : "Intervenție pornită",
      body: `Operatorul a primit solicitarea: ${issueType}. Ajutorul este pe drum.`,
      read: false,
      createdAt: new Date().toISOString()
    });
    setRequestStatus("operator_en_route");
    setFastGuaranteeDeadline(guaranteeDeadline);
    setFastGuaranteeApplied(false);
    setSubmitted(true);
  };

  const renderStep = () => {
    if (step === "location") {
      return (
        <RoadsideLocationStep
          currentAddress={currentAddress}
          onUseCurrentLocation={useCurrentLocation}
          onAddressSelect={setSelectedAddress}
          onPickOnMap={() => setLocationPickerOpen(true)}
          onNext={() => {
            persistLocation();
            setStep("issue");
          }}
        />
      );
    }

    if (step === "issue") {
      return (
        <RoadsideIssueStep
          mode={mode}
          issueType={issueType}
          description={description}
          vehicleType={vehicleType}
          towDestination={towDestination}
          canRoll={canRoll}
          safePlace={safePlace}
          onIssueChange={setIssueType}
          onDescriptionChange={setDescription}
          onVehicleTypeChange={setVehicleType}
          onTowDestinationChange={setTowDestination}
          onCanRollChange={setCanRoll}
          onSafePlaceChange={setSafePlace}
          onBack={() => setStep("location")}
          onNext={() => setStep("photo")}
        />
      );
    }

    if (step === "photo") {
      return (
        <RoadsidePhotoStep
          photo={photo}
          onPhotoChange={setPhoto}
          onBack={() => setStep("issue")}
          onNext={() => setStep("safety")}
        />
      );
    }

    if (step === "safety") {
      return (
        <RoadsideSafetyStep
          mode={mode}
          acknowledged={safetyAcknowledged}
          onBack={() => setStep("photo")}
          onAcknowledge={() => {
            setSafetyAcknowledged(true);
            setStep("confirm");
          }}
        />
      );
    }

    return (
        <RoadsideConfirmStep
          mode={mode}
          issueType={issueType}
          etaMinutes={etaToOperatorMinutes}
          amount={fareEstimate}
          normalPrice={roadsidePrice.normalPrice}
          speedTier={speedTier}
          guaranteeStatus={guarantee.status}
          guaranteeRemainingMinutes={guarantee.remainingMinutes}
          requestStatus={requestStatus}
          paymentMethod={payment.paymentMethod}
          submitted={submitted}
          onSpeedTierChange={setSpeedTier}
          onPaymentChange={payment.setPaymentMethod}
          onConfirmArrival={() => {
            setCustomerConfirmedArrivedAt(new Date().toISOString());
            setRequestStatus("operator_arrived_confirmed");
          }}
          onNotArrived={() => setRequestStatus("operator_en_route")}
          onConfirmSolved={() => {
            setRequestStatus("issue_solved_confirmed");
            window.setTimeout(() => setRequestStatus("completed"), 700);
          }}
          onDisputeSolved={() => setRequestStatus("disputed")}
          onBack={() => setStep("safety")}
          onSubmit={submit}
        />
    );
  };

  return (
    <MapFirstPage bottomSafeArea={false}>
      <LiveMobilityMap
        portalLabel={mode === "tow" ? "Tractare" : "Roadside"}
        activeRole="customer"
        serviceType={mode}
        status={submitted ? "accepted" : "online"}
        userLocation={position}
        pickupLocation={currentAddress}
        roadsideLocation={roadsideLocation}
        etaToPickupMinutes={etaToOperatorMinutes}
        distanceToPickupKm={distanceToOperatorKm}
        paymentMethod={payment.paymentMethod}
        cashEnabled={payment.isCash}
        fareEstimate={fareEstimate}
        rating={4.92}
        showBottomControls={false}
        onLocateMe={(coordinates) => {
          const address = createCurrentLocationSuggestion(coordinates.lat, coordinates.lng);
          setSelectedAddress(address);
          persistLocation(address);
        }}
        className="min-h-[100svh] lg:min-h-[calc(100vh-4rem)]"
      />

      <MapBottomSheet className="absolute inset-x-3 bottom-[var(--floating-bottom-offset)] z-[540] max-h-[min(68svh,640px)] overflow-y-auto md:inset-x-auto md:bottom-5 md:left-5 md:w-[440px] md:rounded-3xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">{mode === "tow" ? "Solicitare tractare" : "Asistență rutieră"}</p>
              <p className="text-xs text-muted-foreground">
                {submitted ? "Ajutorul este pe drum." : "Poziție, problemă, siguranță, confirmare."}
              </p>
            </div>
          </div>
          <MapStatusPill label={`~${etaToOperatorMinutes} min`} tone="success" />
        </div>
        {!submitted && <RoadsideStepProgress currentStep={step} />}
        <div className="mt-4">{renderStep()}</div>
      </MapBottomSheet>
      <LocationPickerSheet
        open={locationPickerOpen}
        title={mode === "tow" ? "Alege locația vehiculului" : "Alege locația intervenției"}
        initialLocation={currentAddress}
        onClose={() => setLocationPickerOpen(false)}
        onConfirm={(address) => {
          setSelectedAddress(address);
          persistLocation(address);
        }}
      />
    </MapFirstPage>
  );
}
