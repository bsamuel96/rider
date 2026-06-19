import { z } from "zod";

const passwordPair = {
  password: z.string().min(8, "Parola trebuie să aibă minimum 8 caractere."),
  confirmPassword: z.string().min(8, "Confirmă parola.")
};

const accountFields = {
  fullName: z.string().min(3, "Introdu numele complet."),
  username: z.string().min(3, "Username-ul trebuie să aibă minimum 3 caractere."),
  email: z.string().email("Introdu un email valid."),
  phone: z.string().min(8, "Introdu un număr de telefon valid."),
  ...passwordPair
};

const withPasswordConfirmation = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.refine((values) => values.password === values.confirmPassword, {
    message: "Parolele nu coincid.",
    path: ["confirmPassword"]
  });

export const customerLoginSchema = z.object({
  identifier: z.string().min(3, "Introdu emailul sau username-ul."),
  password: z.string().min(8, "Parola trebuie să aibă minimum 8 caractere.")
});

export const driverLoginSchema = customerLoginSchema;

export const roadsideLoginSchema = customerLoginSchema;

export const customerRegisterSchema = withPasswordConfirmation(
  z.object({
    ...accountFields,
    primaryAddress: z.string().optional()
  })
);

export const driverRegisterSchema = withPasswordConfirmation(
  z.object({
    ...accountFields,
    licenseNumber: z.string().min(3, "Introdu numărul permisului."),
    licenseExpiry: z.string().min(1, "Introdu data expirării permisului."),
    experienceYears: z.coerce.number().min(0, "Experiența nu poate fi negativă."),
    mainCity: z.string().min(2, "Introdu orașul principal."),
    serviceRegion: z.string().min(2, "Introdu județul sau regiunea."),
    vehicleBrand: z.string().min(2, "Introdu marca vehiculului."),
    vehicleModel: z.string().min(1, "Introdu modelul vehiculului."),
    productionYear: z.coerce.number().min(1990, "Introdu un an valid."),
    plateNumber: z.string().min(4, "Introdu numărul de înmatriculare."),
    vehicleColor: z.string().min(2, "Introdu culoarea."),
    vehicleType: z.enum(["standard", "premium"]),
    seats: z.coerce.number().min(1, "Introdu numărul de locuri.")
  })
);

export const roadsideRegisterSchema = withPasswordConfirmation(
  z.object({
    ...accountFields,
    companyName: z.string().min(2, "Introdu numele companiei."),
    fiscalCode: z.string().min(2, "Introdu CUI / cod fiscal."),
    contactPerson: z.string().min(3, "Introdu persoana de contact."),
    dispatcherPhone: z.string().min(8, "Introdu telefonul dispeceratului."),
    companyEmail: z.string().email("Introdu emailul companiei."),
    mainCity: z.string().min(2, "Introdu orașul principal."),
    serviceRegions: z.string().min(2, "Introdu regiunile acoperite."),
    serviceTypes: z.array(z.string()).min(1, "Alege cel puțin un serviciu."),
    interventionVehicleType: z.enum(["tow_truck", "service_van", "motorcycle", "utility"]),
    interventionPlateNumber: z.string().min(4, "Introdu numărul de înmatriculare."),
    towingCapacity: z.coerce.number().min(0, "Capacitatea nu poate fi negativă."),
    equipment: z.string().min(2, "Introdu echipamentele disponibile.")
  })
);

export type LoginFormValues = z.infer<typeof customerLoginSchema>;
export type CustomerRegisterValues = z.infer<typeof customerRegisterSchema>;
export type DriverRegisterValues = z.infer<typeof driverRegisterSchema>;
export type RoadsideRegisterValues = z.infer<typeof roadsideRegisterSchema>;

export type RegisterFormValues = CustomerRegisterValues | DriverRegisterValues | RoadsideRegisterValues;
