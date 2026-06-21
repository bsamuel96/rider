import {
  demoTransportAlerts,
  demoTransportDrivers,
  demoTransportFleetStats,
  demoTransportRides,
  demoTransportVehicles
} from "@/data/demoTransportFleet";

export function getTransportFleetStats() {
  return demoTransportFleetStats;
}

export function getTransportDrivers() {
  return demoTransportDrivers;
}

export function getTransportVehicles() {
  return demoTransportVehicles;
}

export function getTransportRides() {
  return demoTransportRides;
}

export function getTransportAlerts() {
  return demoTransportAlerts;
}

export function assignTransportDriver(rideId: string, driverId: string) {
  return {
    rideId,
    driverId,
    status: "assigned"
  };
}

export function updateTransportVehicleStatus(vehicleId: string, status: "active" | "maintenance" | "pending_review") {
  return {
    vehicleId,
    status
  };
}
