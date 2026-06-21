import type { Coordinates, TransportFleetStats, TransportVehicleType } from "@/types/domain";

export type DemoTransportVehicle = {
  id: string;
  vehicleType: TransportVehicleType;
  brand: string;
  model: string;
  plateNumber: string;
  driverName: string;
  status: "active" | "maintenance" | "pending_review";
  documentsExpireInDays: number;
};

export type DemoTransportDriver = {
  id: string;
  name: string;
  phone: string;
  status: "online" | "busy" | "offline" | "pending_review";
  vehicleId?: string;
  rating: number;
  lastSeenMinutesAgo: number;
};

export type DemoTransportRide = {
  id: string;
  serviceType: "standard" | "premium";
  pickup: string;
  destination: string;
  status: "searching_driver" | "driver_assigned" | "in_progress" | "completed" | "cancelled";
  driverName?: string;
  fareRon: number;
  paymentMethod: "cash" | "card";
  waitingMinutes: number;
  pickupCoordinates: Coordinates;
  destinationCoordinates: Coordinates;
};

export type DemoTransportAlert = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  actionLabel: string;
};

export const demoTransportFleetStats: TransportFleetStats = {
  onlineDrivers: 5,
  busyDrivers: 2,
  offlineDrivers: 3,
  pendingApprovalDrivers: 1,
  activeCars: 8,
  activeStandardCars: 6,
  activePremiumCars: 2,
  vehiclesInMaintenance: 1,
  vehiclesPendingReview: 2,
  ridesInProgress: 2,
  ridesSearchingDriver: 1,
  ridesToday: 23,
  completedRidesToday: 20,
  cancelledRidesToday: 2,
  grossEarningsToday: 1840,
  cashEarningsToday: 760,
  cardEarningsToday: 1080,
  averageFare: 80
};

export const demoTransportVehicles: DemoTransportVehicle[] = [
  {
    id: "car-101",
    vehicleType: "standard_car",
    brand: "Toyota",
    model: "Corolla",
    plateNumber: "B 101 RID",
    driverName: "Andrei Popa",
    status: "active",
    documentsExpireInDays: 44
  },
  {
    id: "car-220",
    vehicleType: "premium_car",
    brand: "Mercedes",
    model: "E-Class",
    plateNumber: "B 220 RID",
    driverName: "Mihai Ionescu",
    status: "active",
    documentsExpireInDays: 18
  },
  {
    id: "car-330",
    vehicleType: "standard_car",
    brand: "Skoda",
    model: "Octavia",
    plateNumber: "B 330 RID",
    driverName: "Elena Marin",
    status: "maintenance",
    documentsExpireInDays: 92
  },
  {
    id: "car-404",
    vehicleType: "premium_car",
    brand: "BMW",
    model: "5 Series",
    plateNumber: "B 404 RID",
    driverName: "Nealocat",
    status: "pending_review",
    documentsExpireInDays: 12
  }
];

export const demoTransportDrivers: DemoTransportDriver[] = [
  {
    id: "driver-andrei",
    name: "Andrei Popa",
    phone: "+40 721 100 100",
    status: "online",
    vehicleId: "car-101",
    rating: 4.91,
    lastSeenMinutesAgo: 1
  },
  {
    id: "driver-mihai",
    name: "Mihai Ionescu",
    phone: "+40 721 100 101",
    status: "busy",
    vehicleId: "car-220",
    rating: 4.96,
    lastSeenMinutesAgo: 0
  },
  {
    id: "driver-elena",
    name: "Elena Marin",
    phone: "+40 721 100 102",
    status: "offline",
    vehicleId: "car-330",
    rating: 4.83,
    lastSeenMinutesAgo: 82
  },
  {
    id: "driver-ioan",
    name: "Ioan Radu",
    phone: "+40 721 100 103",
    status: "pending_review",
    rating: 0,
    lastSeenMinutesAgo: 0
  }
];

export const demoTransportRides: DemoTransportRide[] = [
  {
    id: "ride-universitate",
    serviceType: "standard",
    pickup: "Universitate",
    destination: "Cotroceni",
    status: "in_progress",
    driverName: "Andrei Popa",
    fareRon: 52,
    paymentMethod: "cash",
    waitingMinutes: 0,
    pickupCoordinates: { lat: 44.4359, lng: 26.1029 },
    destinationCoordinates: { lat: 44.4302, lng: 26.0612 }
  },
  {
    id: "ride-otopeni",
    serviceType: "premium",
    pickup: "Aeroport Otopeni",
    destination: "Floreasca",
    status: "driver_assigned",
    driverName: "Mihai Ionescu",
    fareRon: 118,
    paymentMethod: "card",
    waitingMinutes: 3,
    pickupCoordinates: { lat: 44.5711, lng: 26.085 },
    destinationCoordinates: { lat: 44.4639, lng: 26.1022 }
  },
  {
    id: "ride-tineretului",
    serviceType: "standard",
    pickup: "Tineretului",
    destination: "Piața Victoriei",
    status: "searching_driver",
    fareRon: 44,
    paymentMethod: "card",
    waitingMinutes: 7,
    pickupCoordinates: { lat: 44.4138, lng: 26.1027 },
    destinationCoordinates: { lat: 44.452, lng: 26.0871 }
  }
];

export const demoTransportAlerts: DemoTransportAlert[] = [
  {
    id: "ride-waiting",
    title: "Cursă așteaptă șofer",
    body: "Tineretului -> Piața Victoriei așteaptă de 7 min.",
    severity: "warning",
    actionLabel: "Assign driver"
  },
  {
    id: "docs-expire",
    title: "Documente vehicul aproape expirate",
    body: "B 220 RID are documente care expiră în 18 zile.",
    severity: "warning",
    actionLabel: "View vehicle"
  },
  {
    id: "high-demand",
    title: "Cerere crescută",
    body: "Zona Universitate are cerere ridicată pentru Standard.",
    severity: "info",
    actionLabel: "View zone"
  }
];
