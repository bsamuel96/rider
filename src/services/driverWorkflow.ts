import type {
  CashStatus,
  DriverWorkflowAction,
  DriverWorkflowStatus,
  PaymentMethod,
  ServiceType
} from "@/types/domain";

const transitions: Record<DriverWorkflowStatus, DriverWorkflowStatus[]> = {
  offline: ["preflight"],
  preflight: ["available", "offline"],
  available: ["offer_received", "offline", "suspended"],
  offer_received: ["offer_accepted", "available"],
  offer_accepted: ["en_route_to_pickup", "available"],
  en_route_to_pickup: ["arrived_at_pickup", "available"],
  arrived_at_pickup: ["waiting_for_customer", "available"],
  waiting_for_customer: ["trip_started", "available"],
  trip_started: ["en_route_to_destination", "available"],
  en_route_to_destination: ["arrived_at_destination", "available"],
  arrived_at_destination: ["trip_completed"],
  trip_completed: ["cash_collection_required", "rating_customer", "available"],
  cash_collection_required: ["cash_collected", "available"],
  cash_collected: ["rating_customer"],
  rating_customer: ["available"],
  cooldown: ["available", "offline"],
  suspended: ["offline"]
};

const labels: Record<DriverWorkflowStatus, string> = {
  offline: "Offline",
  preflight: "Verificare înainte de tură",
  available: "Disponibil",
  offer_received: "Cerere nouă",
  offer_accepted: "Cursă acceptată",
  en_route_to_pickup: "Spre client",
  arrived_at_pickup: "Ajuns la pickup",
  waiting_for_customer: "Aștepți clientul",
  trip_started: "Cursă începută",
  en_route_to_destination: "Spre destinație",
  arrived_at_destination: "Ajuns la destinație",
  trip_completed: "Cursă finalizată",
  cash_collection_required: "Încasează cash",
  cash_collected: "Cash încasat",
  rating_customer: "Evaluează clientul",
  cooldown: "Pauză scurtă",
  suspended: "Suspendat"
};

const descriptions: Record<DriverWorkflowStatus, string> = {
  offline: "Nu primești cereri. Pornește o tură când ești pregătit.",
  preflight: "Confirmă că vehiculul, documentele și locația sunt pregătite.",
  available: "Ești vizibil pentru curse noi în zona ta.",
  offer_received: "Ai o cerere cu timp limitat pentru acceptare.",
  offer_accepted: "Cursa este rezervată pentru tine.",
  en_route_to_pickup: "Mergi către punctul de pickup.",
  arrived_at_pickup: "Marchează sosirea și pregătește preluarea clientului.",
  waiting_for_customer: "Clientul a fost notificat că ai ajuns.",
  trip_started: "Confirmă pornirea spre destinație.",
  en_route_to_destination: "Cursa este în desfășurare.",
  arrived_at_destination: "Ai ajuns. Finalizează cursa când oprirea este sigură.",
  trip_completed: "Verifică plata și închide cursa.",
  cash_collection_required: "Încasează suma afișată înainte de evaluare.",
  cash_collected: "Încasarea cash a fost confirmată.",
  rating_customer: "Lasă o evaluare scurtă pentru client.",
  cooldown: "Ia o pauză scurtă înainte să revii disponibil.",
  suspended: "Contul nu poate primi curse până la clarificare."
};

export function canTransitionDriverStatus(
  current: DriverWorkflowStatus,
  next: DriverWorkflowStatus,
  paymentMethod?: PaymentMethod
) {
  if (current === "trip_completed") {
    return paymentMethod === "cash" ? next === "cash_collection_required" : next === "rating_customer";
  }

  return transitions[current]?.includes(next) ?? false;
}

export function getNextDriverAction(status: DriverWorkflowStatus, paymentMethod: PaymentMethod = "cash") {
  if (status === "trip_completed") {
    return paymentMethod === "cash" ? "cash_collection_required" : "rating_customer";
  }

  return transitions[status]?.[0];
}

export function getDriverStatusLabel(status: DriverWorkflowStatus) {
  return labels[status];
}

export function getDriverStatusDescription(status: DriverWorkflowStatus) {
  return descriptions[status];
}

export function getDriverPrimaryAction(
  status: DriverWorkflowStatus,
  options: { paymentMethod?: PaymentMethod; serviceType?: ServiceType } = {}
): DriverWorkflowAction | undefined {
  const paymentMethod = options.paymentMethod ?? "cash";
  const serviceType = options.serviceType ?? "standard";

  const actions: Partial<Record<DriverWorkflowStatus, DriverWorkflowAction>> = {
    offline: {
      id: "go-online",
      label: "Începe tura",
      nextStatus: "preflight"
    },
    preflight: {
      id: "complete-preflight",
      label: "Devino disponibil",
      nextStatus: "available"
    },
    offer_received: {
      id: "accept-offer",
      label: serviceType === "tow" ? "Acceptă tractarea" : "Acceptă cursa",
      nextStatus: "offer_accepted"
    },
    offer_accepted: {
      id: "en-route-pickup",
      label: "Merg spre client",
      nextStatus: "en_route_to_pickup"
    },
    en_route_to_pickup: {
      id: "arrived-pickup",
      label: "Am ajuns la pickup",
      nextStatus: "arrived_at_pickup"
    },
    arrived_at_pickup: {
      id: "wait-customer",
      label: "Anunță clientul",
      nextStatus: "waiting_for_customer"
    },
    waiting_for_customer: {
      id: "start-trip",
      label: "Încep cursa",
      nextStatus: "trip_started"
    },
    trip_started: {
      id: "drive-destination",
      label: "Pornește spre destinație",
      nextStatus: "en_route_to_destination"
    },
    en_route_to_destination: {
      id: "arrived-destination",
      label: "Am ajuns la destinație",
      nextStatus: "arrived_at_destination"
    },
    arrived_at_destination: {
      id: "complete-trip",
      label: "Finalizează cursa",
      nextStatus: "trip_completed"
    },
    trip_completed: {
      id: paymentMethod === "cash" ? "collect-cash" : "rate-customer",
      label: paymentMethod === "cash" ? "Încasează cash" : "Evaluează clientul",
      nextStatus: paymentMethod === "cash" ? "cash_collection_required" : "rating_customer"
    },
    cash_collection_required: {
      id: "cash-collected",
      label: "Am încasat",
      nextStatus: "cash_collected"
    },
    cash_collected: {
      id: "rate-customer",
      label: "Evaluează clientul",
      nextStatus: "rating_customer"
    },
    rating_customer: {
      id: "finish-rating",
      label: "Trimite evaluarea",
      nextStatus: "available"
    },
    cooldown: {
      id: "resume-available",
      label: "Revin disponibil",
      nextStatus: "available"
    }
  };

  return actions[status];
}

export function getDriverSecondaryActions(status: DriverWorkflowStatus): DriverWorkflowAction[] {
  if (status === "available" || status === "preflight" || status === "cooldown") {
    return [
      {
        id: "go-offline",
        label: "Offline",
        nextStatus: "offline",
        variant: "secondary"
      }
    ];
  }

  if (status === "offer_received") {
    return [
      {
        id: "reject-offer",
        label: "Refuză",
        nextStatus: "available",
        variant: "secondary"
      }
    ];
  }

  if (isDriverOnActiveRide(status)) {
    return [
      {
        id: "contact-support",
        label: "Suport",
        variant: "secondary"
      },
      {
        id: "cancel-ride",
        label: "Anulează",
        nextStatus: "available",
        variant: "destructive"
      }
    ];
  }

  return [];
}

export function isDriverOnActiveRide(status: DriverWorkflowStatus) {
  return [
    "offer_accepted",
    "en_route_to_pickup",
    "arrived_at_pickup",
    "waiting_for_customer",
    "trip_started",
    "en_route_to_destination",
    "arrived_at_destination",
    "trip_completed",
    "cash_collection_required",
    "cash_collected",
    "rating_customer"
  ].includes(status);
}

export function requiresCashCollection(status: DriverWorkflowStatus, paymentMethod?: PaymentMethod, cashStatus?: CashStatus) {
  return (
    paymentMethod === "cash" &&
    cashStatus !== "collected" &&
    (status === "trip_completed" || status === "cash_collection_required")
  );
}

export function shouldPublishDriverLocation(status: DriverWorkflowStatus) {
  return !["offline", "preflight", "suspended"].includes(status);
}
