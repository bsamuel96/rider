export type AuthInstance = "customer" | "driver" | "roadside";

export type UserRole = "client" | "driver" | "roadside_operator" | "admin";

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

export type Coordinates = {
  lat: number;
  lng: number;
};

export type AddressSuggestion = Coordinates & {
  id: string;
  label: string;
  street?: string;
  number?: string;
  city?: string;
  county?: string;
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
  registrationStatus: RegistrationStatus;
  theme: ThemePreference;
  preferredPaymentMethod?: PaymentMethod;
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
  capacityKg?: number;
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
