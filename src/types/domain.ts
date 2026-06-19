export type UserRole = "client" | "driver" | "roadside_operator" | "admin";

export type AuthInstance = "customer" | "driver" | "roadside";

export type RegistrationStatus = "draft" | "pending_review" | "active" | "suspended";

export type ThemePreference = "light" | "dark" | "system";

export type ServiceType = "standard" | "premium" | "tow" | "roadside";

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
  registrationStatus?: RegistrationStatus;
  theme: ThemePreference;
};

export type InstanceRegistrationPayload = {
  primaryAddress?: string;
  licenseNumber?: string;
  vehiclePlate?: string;
  companyName?: string;
  serviceRegion?: string;
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
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};
