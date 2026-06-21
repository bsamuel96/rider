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

export type RoadsideIssue = "flat_tire" | "battery" | "engine" | "accident" | "fuel" | "other";

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
  | "Recomand";

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
