import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));
const optionalPhone = z.string().trim().min(6, "Telefonul este prea scurt.").optional().or(z.literal(""));

export const commonProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Numele este obligatoriu."),
  username: optionalText,
  email: z.string().trim().email("Email invalid."),
  phone: optionalPhone,
  emergencyContactName: optionalText,
  emergencyContactPhone: optionalPhone,
  language: optionalText,
  defaultAddress: optionalText,
  homeAddress: optionalText,
  workAddress: optionalText
});

export const customerProfileSchema = commonProfileSchema.extend({
  homeAddress: optionalText,
  workAddress: optionalText
});

export const driverProfileSchema = commonProfileSchema.extend({
  driverDisplayName: optionalText,
  licenseNumber: optionalText,
  serviceRegion: optionalText,
  availabilityPreferences: optionalText
});

export const roadsideProfileSchema = commonProfileSchema.extend({
  companyName: optionalText,
  dispatcherPhone: optionalPhone,
  serviceRegions: optionalText,
  serviceTypes: optionalText
});

export const vehicleProfileSchema = z.object({
  brand: optionalText,
  model: optionalText,
  productionYear: z.coerce.number().int().min(1980).max(2100).optional().or(z.literal("")),
  color: optionalText,
  plateNumber: z.string().trim().min(3, "Numărul de înmatriculare este obligatoriu."),
  vehicleType: z.string().trim().min(2, "Tipul vehiculului este obligatoriu."),
  seats: z.coerce.number().int().min(1).max(12).optional().or(z.literal("")),
  fuelType: optionalText,
  capacityKg: z.coerce.number().int().min(0).optional().or(z.literal("")),
  notes: optionalText,
  equipment: optionalText,
  serviceTypes: optionalText
});

export type CommonProfileValues = z.infer<typeof commonProfileSchema>;
export type DriverProfileValues = z.infer<typeof driverProfileSchema>;
export type RoadsideProfileValues = z.infer<typeof roadsideProfileSchema>;
export type VehicleProfileValues = z.infer<typeof vehicleProfileSchema>;
