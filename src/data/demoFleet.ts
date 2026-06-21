import type { FleetType, FleetVehicleKind, RoadsideRequestStatus } from "@/types/domain";

export type DemoFleetVehicle = {
  id: string;
  fleetType: FleetType;
  vehicleKind: FleetVehicleKind;
  brand: string;
  model: string;
  plateNumber: string;
  driverOrOperator: string;
  status: "active" | "maintenance" | "pending_review";
  service: string;
};

export type DemoFleetPerson = {
  id: string;
  fleetType: FleetType;
  name: string;
  role: "driver" | "roadside_operator";
  phone: string;
  status: "online" | "offline" | "busy";
  activeJob?: string;
};

export type DemoFleetJob = {
  id: string;
  fleetType: FleetType;
  label: string;
  status: string;
  valueRon: number;
  assignee: string;
  speedTier?: "normal" | "fast";
  guaranteeMinutesLeft?: number;
  roadsideStatus?: RoadsideRequestStatus;
};

export const demoFleetSummary = {
  transport: {
    activeDrivers: 5,
    activeVehicles: 8,
    ridesToday: 23,
    earningsTodayRon: 1840,
    pendingRides: 1,
    inProgressRides: 2
  },
  roadside: {
    activeOperators: 4,
    serviceVehicles: 7,
    activeRequests: 3,
    fastSlaRisk: 1,
    arrivalPendingConfirmations: 1,
    solvedPendingConfirmations: 1,
    earningsTodayRon: 2120
  }
};

export const demoFleetVehicles: DemoFleetVehicle[] = [
  {
    id: "transport-1",
    fleetType: "transport",
    vehicleKind: "standard_car",
    brand: "Toyota",
    model: "Corolla",
    plateNumber: "B 101 RID",
    driverOrOperator: "Andrei Popa",
    status: "active",
    service: "Standard"
  },
  {
    id: "transport-2",
    fleetType: "transport",
    vehicleKind: "premium_car",
    brand: "Mercedes",
    model: "E-Class",
    plateNumber: "B 220 RID",
    driverOrOperator: "Mihai Ionescu",
    status: "active",
    service: "Premium"
  },
  {
    id: "transport-3",
    fleetType: "transport",
    vehicleKind: "standard_car",
    brand: "Skoda",
    model: "Octavia",
    plateNumber: "B 330 RID",
    driverOrOperator: "Elena Marin",
    status: "maintenance",
    service: "Standard"
  },
  {
    id: "roadside-1",
    fleetType: "roadside",
    vehicleKind: "tow_truck",
    brand: "MAN",
    model: "TGL",
    plateNumber: "B 401 TOW",
    driverOrOperator: "Service Nord",
    status: "active",
    service: "Tractare"
  },
  {
    id: "roadside-2",
    fleetType: "roadside",
    vehicleKind: "service_van",
    brand: "Ford",
    model: "Transit",
    plateNumber: "B 402 RSV",
    driverOrOperator: "Rapid Assist",
    status: "active",
    service: "Baterie / combustibil"
  },
  {
    id: "roadside-3",
    fleetType: "roadside",
    vehicleKind: "utility_vehicle",
    brand: "Dacia",
    model: "Duster",
    plateNumber: "B 403 RSV",
    driverOrOperator: "Intervenții Sud",
    status: "pending_review",
    service: "Pană / chei"
  }
];

export const demoFleetPeople: DemoFleetPerson[] = [
  {
    id: "driver-1",
    fleetType: "transport",
    name: "Andrei Popa",
    role: "driver",
    phone: "+40 721 100 100",
    status: "online",
    activeJob: "Cursă spre Piața Victoriei"
  },
  {
    id: "driver-2",
    fleetType: "transport",
    name: "Mihai Ionescu",
    role: "driver",
    phone: "+40 721 100 101",
    status: "busy",
    activeJob: "Premium · Otopeni"
  },
  {
    id: "driver-3",
    fleetType: "transport",
    name: "Elena Marin",
    role: "driver",
    phone: "+40 721 100 102",
    status: "offline"
  },
  {
    id: "operator-1",
    fleetType: "roadside",
    name: "Service Nord",
    role: "roadside_operator",
    phone: "+40 731 200 100",
    status: "busy",
    activeJob: "Rapid · DN1"
  },
  {
    id: "operator-2",
    fleetType: "roadside",
    name: "Rapid Assist",
    role: "roadside_operator",
    phone: "+40 731 200 101",
    status: "online"
  },
  {
    id: "operator-3",
    fleetType: "roadside",
    name: "Intervenții Sud",
    role: "roadside_operator",
    phone: "+40 731 200 102",
    status: "online"
  }
];

export const demoFleetJobs: DemoFleetJob[] = [
  {
    id: "ride-1",
    fleetType: "transport",
    label: "Standard · Universitate -> Cotroceni",
    status: "În progres",
    valueRon: 52,
    assignee: "Andrei Popa"
  },
  {
    id: "ride-2",
    fleetType: "transport",
    label: "Premium · Otopeni -> Floreasca",
    status: "Șofer în drum",
    valueRon: 118,
    assignee: "Mihai Ionescu"
  },
  {
    id: "roadside-fast",
    fleetType: "roadside",
    label: "Rapid · Pană DN1",
    status: "Risc SLA",
    valueRon: 143,
    assignee: "Service Nord",
    speedTier: "fast",
    guaranteeMinutesLeft: 7,
    roadsideStatus: "operator_en_route"
  },
  {
    id: "roadside-arrived",
    fleetType: "roadside",
    label: "Baterie · Pipera",
    status: "Sosire de confirmat",
    valueRon: 95,
    assignee: "Rapid Assist",
    speedTier: "normal",
    roadsideStatus: "operator_arrived_pending_customer"
  },
  {
    id: "roadside-solved",
    fleetType: "roadside",
    label: "Tractare · Berceni",
    status: "Rezolvare de confirmat",
    valueRon: 180,
    assignee: "Intervenții Sud",
    speedTier: "normal",
    roadsideStatus: "issue_solved_pending_customer"
  }
];
