export type AuthInstance = "customer" | "driver" | "roadside" | "fleet_manager";

export type UserRole = "client" | "driver" | "roadside_operator" | "fleet_manager" | "admin";

export type FleetScope = "transport" | "roadside" | "both";

export type RegistrationStatus = "draft" | "pending_review" | "active" | "suspended" | "rejected";

export type ThemePreference = "light" | "dark" | "system";

export type ServiceType = "standard" | "premium" | "tow" | "roadside";

export type PaymentMethod = "cash" | "card";

export type CashStatus = "not_required" | "pending_collection" | "collected" | "disputed";

export type RouteProvider = "osrm" | "fallback" | "none";

export type BookingStatus =
  | "searching"
  | "confirmed"
  | "driver_en_route"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export type DriverWorkflowStatus =
  | "offline"
  | "preflight"
  | "available"
  | "offer_received"
  | "offer_accepted"
  | "en_route_to_pickup"
  | "arrived_at_pickup"
  | "waiting_for_customer"
  | "trip_started"
  | "en_route_to_destination"
  | "arrived_at_destination"
  | "trip_completed"
  | "cash_collection_required"
  | "cash_collected"
  | "rating_customer"
  | "cooldown"
  | "suspended";

export type RoadsideIssue = "flat_tire" | "battery" | "engine" | "accident" | "fuel" | "locked_keys" | "other";

export type RoadsideSpeedTier = "normal" | "fast";

export type RoadsideRequestStatus =
  | "draft"
  | "searching"
  | "accepted"
  | "operator_en_route"
  | "operator_arrived_pending_customer"
  | "operator_arrived_confirmed"
  | "issue_in_progress"
  | "issue_solved_pending_customer"
  | "issue_solved_confirmed"
  | "completed"
  | "cancelled"
  | "disputed";

export type RoadsideRequest = {
  id: string;
  userId: string;
  operatorId?: string;
  issueType: RoadsideIssue;
  speedTier: RoadsideSpeedTier;
  normalPrice: number;
  fastPrice: number;
  finalPrice: number;
  fastGuaranteeDeadline?: string;
  fastGuaranteeApplied?: boolean;
  acceptedAt?: string;
  customerConfirmedArrivedAt?: string;
  customerConfirmedSolvedAt?: string;
  paymentMethod: PaymentMethod;
  status: RoadsideRequestStatus;
};

export type FleetType = "transport" | "roadside";

export type TransportVehicleType = "standard_car" | "premium_car";

export type RoadsideVehicleType = "tow_truck" | "service_van" | "utility_vehicle" | "motorcycle";

export type FleetVehicleKind = TransportVehicleType | RoadsideVehicleType;

export type TransportFleetStats = {
  onlineDrivers: number;
  busyDrivers: number;
  offlineDrivers: number;
  pendingApprovalDrivers: number;
  activeCars: number;
  activeStandardCars: number;
  activePremiumCars: number;
  vehiclesInMaintenance: number;
  vehiclesPendingReview: number;
  ridesInProgress: number;
  ridesSearchingDriver: number;
  ridesToday: number;
  completedRidesToday: number;
  cancelledRidesToday: number;
  grossEarningsToday: number;
  cashEarningsToday: number;
  cardEarningsToday: number;
  averageFare: number;
};

export type RoadsideFleetStats = {
  onlineOperators: number;
  busyOperators: number;
  offlineOperators: number;
  pendingReviewOperators: number;
  activeTowTrucks: number;
  activeServiceVans: number;
  vehiclesInMaintenance: number;
  vehiclesPendingReview: number;
  activeRequests: number;
  newRequests: number;
  acceptedRequests: number;
  operatorsEnRoute: number;
  arrivalConfirmationsPending: number;
  issueInProgress: number;
  solvedConfirmationsPending: number;
  disputedRequests: number;
  fastRequestsActive: number;
  fastRequestsWithinGuarantee: number;
  fastRequestsAtRisk: number;
  guaranteesAppliedToday: number;
  averageArrivalMinutes: number;
  grossEarningsToday: number;
  normalRequestsRevenue: number;
  fastRequestsRevenue: number;
  guaranteeDiscountsApplied: number;
  cashEarningsToday: number;
  cardEarningsToday: number;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type LocationSelectionSource = "search" | "current_location" | "map_pin" | "recent" | "favorite";

export type AddressSuggestion = Coordinates & {
  id: string;
  label: string;
  street?: string;
  number?: string;
  city?: string;
  county?: string;
  source?: LocationSelectionSource;
  accuracyMeters?: number;
  rawAddress?: unknown;
};

export type SavedAddress = AddressSuggestion & {
  userId?: string;
  type: "home" | "work" | "favorite" | "recent";
};

export type Profile = {
  id: string;
  email: string;
  phone?: string;
  username?: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  activeInstance?: AuthInstance;
  fleetScope?: FleetScope;
  registrationStatus: RegistrationStatus;
  theme: ThemePreference;
  preferredPaymentMethod?: PaymentMethod;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  language?: string;
  defaultAddress?: string;
  homeAddress?: string;
  workAddress?: string;
};

export type CustomerNotification = {
  id: string;
  title: string;
  body: string;
  type: "promo" | "safety" | "payment" | "system";
  dismissible: boolean;
  actionLabel?: string;
  actionPath?: string;
};

export type RecentLocation = {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  lastUsedAt: string;
  source?: LocationSelectionSource;
};

export type DriverProfile = {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry?: string;
  experienceYears: number;
  mainCity?: string;
  serviceRegion?: string;
  rating: number;
  totalRides: number;
  online: boolean;
};

export type RoadsideOperatorProfile = {
  id: string;
  userId: string;
  companyName?: string;
  fiscalCode?: string;
  dispatcherPhone?: string;
  companyEmail?: string;
  mainCity?: string;
  serviceRegions: string[];
  serviceTypes: string[];
  online: boolean;
};

export type VehicleProfile = {
  id: string;
  ownerId?: string;
  ownerRole?: Extract<UserRole, "driver" | "roadside_operator">;
  vehicleType: string;
  brand?: string;
  model?: string;
  plateNumber?: string;
  color?: string;
  productionYear?: number;
  seats?: number;
  fuelType?: string;
  capacityKg?: number;
  photoUrl?: string;
  notes?: string;
  equipment?: string;
  serviceTypes?: string[];
  vehicleStatus: "pending_review" | "active" | "maintenance" | "suspended" | "retired";
};

export type UserDocument = {
  id: string;
  userId: string;
  vehicleId?: string;
  documentType: string;
  filePath: string;
  status: "pending_review" | "approved" | "rejected" | "expired";
  rejectionReason?: string;
  expiresAt?: string;
};

export type ServiceOption = {
  type: ServiceType;
  title: string;
  description: string;
  etaMinutes: number;
  basePrice: number;
  seats?: number;
  issueHint?: string;
};

export type BookingDraft = {
  pickup?: AddressSuggestion;
  destination?: AddressSuggestion;
  serviceType?: ServiceType;
  distanceKm?: number;
  durationMinutes?: number;
  price?: number;
  paymentMethod?: PaymentMethod;
  cashRequired?: boolean;
  cashStatus?: CashStatus;
  fareEstimate?: number;
  currency?: "RON";
  roadsideSpeedTier?: RoadsideSpeedTier;
  roadsideNormalPrice?: number;
  roadsideFastPrice?: number;
  roadsideFinalPrice?: number;
  roadsideFastGuaranteeDeadline?: string;
  roadsideFastGuaranteeApplied?: boolean;
};

export type DriverRideOffer = {
  id: string;
  bookingId: string;
  customerName: string;
  customerRating: number;
  pickupAddress: string;
  destinationAddress: string;
  pickup: Coordinates;
  destination: Coordinates;
  serviceType: ServiceType;
  paymentMethod: PaymentMethod;
  fareEstimate: number;
  currency: "RON";
  distanceToPickupKm: number;
  routeDistanceKm: number;
  etaToPickupMinutes: number;
  etaToDestinationMinutes: number;
  createdAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "rejected" | "expired";
};

export type DriverActiveBooking = Omit<DriverRideOffer, "status"> & {
  status: DriverWorkflowStatus;
  acceptedAt?: string;
  driverEnRouteAt?: string;
  arrivedAt?: string;
  tripStartedAt?: string;
  completedAt?: string;
  cashStatus: CashStatus;
};

export type DriverAvailability = {
  driverId: string;
  online: boolean;
  status: DriverWorkflowStatus;
  currentLocation?: Coordinates;
  shiftStartedAt?: string;
  updatedAt: string;
};

export type DriverShiftSummary = {
  id: string;
  driverId: string;
  startedAt: string;
  endedAt?: string;
  onlineMinutes: number;
  completedRides: number;
  grossEarnings: number;
  cashCollected: number;
  cardEarnings: number;
  currency: "RON";
};

export type DriverEarningsLedgerEntry = {
  id: string;
  bookingId?: string;
  label: string;
  amount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
};

export type DriverWorkflowAction = {
  id: string;
  label: string;
  nextStatus?: DriverWorkflowStatus;
  variant?: "primary" | "secondary" | "destructive";
};

export type StreetRoute = {
  points: Coordinates[];
  distanceKm?: number;
  durationMinutes?: number;
  provider: RouteProvider;
};

export type RatingTag =
  | "Curat"
  | "Politicos"
  | "Rapid"
  | "Confortabil"
  | "Sigur"
  | "Profesionist"
  | "Echipat"
  | "Clar"
  | "Recomand"
  | "La timp"
  | "Locație clară"
  | "Problemă plată"
  | "Nu s-a prezentat";

export type RatingDraft = {
  value: number;
  tags: RatingTag[];
  comment?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};
