import type { Coordinates, RoadsideFleetStats, RoadsideRequestStatus, RoadsideVehicleType } from "@/types/domain";

export type DemoRoadsideVehicle = {
  id: string;
  vehicleType: RoadsideVehicleType;
  brand: string;
  model: string;
  plateNumber: string;
  operatorName: string;
  status: "active" | "maintenance" | "pending_review";
  equipment: string[];
};

export type DemoRoadsideOperator = {
  id: string;
  name: string;
  phone: string;
  status: "online" | "busy" | "offline" | "pending_review";
  serviceTypes: string[];
  vehicleId?: string;
  rating: number;
};

export type DemoRoadsideRequest = {
  id: string;
  issueType: "tow" | "battery" | "flat_tire" | "fuel" | "accident" | "engine" | "other";
  speedTier: "normal" | "fast";
  label: string;
  customerLocation: string;
  status: RoadsideRequestStatus;
  operatorName?: string;
  vehicleId?: string;
  normalPriceRon: number;
  finalPriceRon: number;
  guaranteeMinutesLeft?: number;
  guaranteeApplied?: boolean;
  paymentMethod: "cash" | "card";
  coordinates: Coordinates;
};

export type DemoRoadsideAlert = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  actionLabel: string;
};

export const demoRoadsideFleetStats: RoadsideFleetStats = {
  onlineOperators: 4,
  busyOperators: 2,
  offlineOperators: 1,
  pendingReviewOperators: 1,
  activeTowTrucks: 3,
  activeServiceVans: 4,
  vehiclesInMaintenance: 1,
  vehiclesPendingReview: 1,
  activeRequests: 3,
  newRequests: 1,
  acceptedRequests: 1,
  operatorsEnRoute: 1,
  arrivalConfirmationsPending: 1,
  issueInProgress: 1,
  solvedConfirmationsPending: 1,
  disputedRequests: 1,
  fastRequestsActive: 2,
  fastRequestsWithinGuarantee: 1,
  fastRequestsAtRisk: 1,
  guaranteesAppliedToday: 1,
  averageArrivalMinutes: 24,
  grossEarningsToday: 2120,
  normalRequestsRevenue: 1160,
  fastRequestsRevenue: 960,
  guaranteeDiscountsApplied: 95,
  cashEarningsToday: 980,
  cardEarningsToday: 1140
};

export const demoRoadsideVehicles: DemoRoadsideVehicle[] = [
  {
    id: "tow-401",
    vehicleType: "tow_truck",
    brand: "MAN",
    model: "TGL",
    plateNumber: "B 401 TOW",
    operatorName: "Service Nord",
    status: "active",
    equipment: ["Platformă", "Troliu", "Accident response"]
  },
  {
    id: "van-402",
    vehicleType: "service_van",
    brand: "Ford",
    model: "Transit",
    plateNumber: "B 402 RSV",
    operatorName: "Rapid Assist",
    status: "active",
    equipment: ["Battery booster", "Fuel delivery", "Flat tire kit"]
  },
  {
    id: "utility-403",
    vehicleType: "utility_vehicle",
    brand: "Dacia",
    model: "Duster",
    plateNumber: "B 403 RSV",
    operatorName: "Intervenții Sud",
    status: "pending_review",
    equipment: ["Flat tire kit", "Tools"]
  },
  {
    id: "moto-404",
    vehicleType: "motorcycle",
    brand: "Honda",
    model: "NC750X",
    plateNumber: "B 404 MTO",
    operatorName: "Rapid Urban",
    status: "maintenance",
    equipment: ["Battery booster", "Small tools"]
  }
];

export const demoRoadsideOperators: DemoRoadsideOperator[] = [
  {
    id: "operator-nord",
    name: "Service Nord",
    phone: "+40 731 200 100",
    status: "busy",
    serviceTypes: ["tow", "accident"],
    vehicleId: "tow-401",
    rating: 4.92
  },
  {
    id: "operator-rapid",
    name: "Rapid Assist",
    phone: "+40 731 200 101",
    status: "online",
    serviceTypes: ["battery", "fuel", "flat_tire"],
    vehicleId: "van-402",
    rating: 4.89
  },
  {
    id: "operator-sud",
    name: "Intervenții Sud",
    phone: "+40 731 200 102",
    status: "busy",
    serviceTypes: ["flat_tire", "engine"],
    vehicleId: "utility-403",
    rating: 4.81
  },
  {
    id: "operator-urban",
    name: "Rapid Urban",
    phone: "+40 731 200 103",
    status: "pending_review",
    serviceTypes: ["battery"],
    vehicleId: "moto-404",
    rating: 0
  }
];

export const demoRoadsideRequests: DemoRoadsideRequest[] = [
  {
    id: "request-dn1-fast",
    issueType: "flat_tire",
    speedTier: "fast",
    label: "Rapid · Pană DN1",
    customerLocation: "DN1, Otopeni",
    status: "operator_en_route",
    operatorName: "Service Nord",
    vehicleId: "tow-401",
    normalPriceRon: 95,
    finalPriceRon: 143,
    guaranteeMinutesLeft: 7,
    paymentMethod: "card",
    coordinates: { lat: 44.541, lng: 26.073 }
  },
  {
    id: "request-pipera-battery",
    issueType: "battery",
    speedTier: "normal",
    label: "Baterie descărcată",
    customerLocation: "Pipera",
    status: "operator_arrived_pending_customer",
    operatorName: "Rapid Assist",
    vehicleId: "van-402",
    normalPriceRon: 95,
    finalPriceRon: 95,
    paymentMethod: "cash",
    coordinates: { lat: 44.487, lng: 26.121 }
  },
  {
    id: "request-berceni-tow",
    issueType: "tow",
    speedTier: "normal",
    label: "Tractare Berceni",
    customerLocation: "Berceni",
    status: "issue_solved_pending_customer",
    operatorName: "Intervenții Sud",
    vehicleId: "utility-403",
    normalPriceRon: 180,
    finalPriceRon: 180,
    paymentMethod: "cash",
    coordinates: { lat: 44.378, lng: 26.114 }
  },
  {
    id: "request-guarantee-applied",
    issueType: "fuel",
    speedTier: "fast",
    label: "Rapid · Fără combustibil",
    customerLocation: "Militari",
    status: "disputed",
    operatorName: "Rapid Urban",
    vehicleId: "moto-404",
    normalPriceRon: 95,
    finalPriceRon: 95,
    guaranteeApplied: true,
    paymentMethod: "card",
    coordinates: { lat: 44.437, lng: 26.02 }
  }
];

export const demoRoadsideAlerts: DemoRoadsideAlert[] = [
  {
    id: "fast-risk",
    title: "Rapid aproape de garanție",
    body: "Pană DN1 mai are 7 min până la garanția de 30 min.",
    severity: "critical",
    actionLabel: "View guarantee"
  },
  {
    id: "arrival-pending",
    title: "Sosire neconfirmată",
    body: "Clientul din Pipera nu a confirmat încă sosirea echipajului.",
    severity: "warning",
    actionLabel: "Contact operator"
  },
  {
    id: "solved-pending",
    title: "Rezolvare de confirmat",
    body: "Tractarea Berceni așteaptă confirmarea finală a clientului.",
    severity: "warning",
    actionLabel: "View request"
  }
];
