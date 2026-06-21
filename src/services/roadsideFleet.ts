import {
  demoRoadsideAlerts,
  demoRoadsideFleetStats,
  demoRoadsideOperators,
  demoRoadsideRequests,
  demoRoadsideVehicles
} from "@/data/demoRoadsideFleet";

export function getRoadsideFleetStats() {
  return demoRoadsideFleetStats;
}

export function getRoadsideOperators() {
  return demoRoadsideOperators;
}

export function getRoadsideVehicles() {
  return demoRoadsideVehicles;
}

export function getRoadsideRequests() {
  return demoRoadsideRequests;
}

export function getFastSlaRequests() {
  return demoRoadsideRequests.filter((request) => request.speedTier === "fast");
}

export function getRoadsideAlerts() {
  return demoRoadsideAlerts;
}

export function assignRoadsideOperator(requestId: string, operatorId: string) {
  return {
    requestId,
    operatorId,
    status: "assigned"
  };
}

export function assignTowTruck(requestId: string, vehicleId: string) {
  return {
    requestId,
    vehicleId,
    status: "vehicle_assigned"
  };
}

export function updateRoadsideRequestStatus(requestId: string, status: string) {
  return {
    requestId,
    status
  };
}
