import type { ServiceOption } from "@/types/domain";

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Rider";

export const DEFAULT_CENTER = {
  lat: Number(import.meta.env.VITE_DEFAULT_LAT || 44.4268),
  lng: Number(import.meta.env.VITE_DEFAULT_LNG || 26.1025)
};

export const TILE_URL = import.meta.env.VITE_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const NOMINATIM_URL = import.meta.env.VITE_NOMINATIM_URL || "https://nominatim.openstreetmap.org";

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    type: "standard",
    title: "Mașină Standard",
    description: "4 locuri, economic",
    etaMinutes: 4,
    basePrice: 9,
    seats: 4
  },
  {
    type: "premium",
    title: "Mașină Premium",
    description: "Confort ridicat, șofer premium",
    etaMinutes: 7,
    basePrice: 18,
    seats: 4
  },
  {
    type: "tow",
    title: "Tractare",
    description: "Transport vehicul defect",
    etaMinutes: 18,
    basePrice: 110,
    issueHint: "Vehicul defect"
  },
  {
    type: "roadside",
    title: "Asistență Rutieră",
    description: "Baterie, pană, combustibil, pornire motor",
    etaMinutes: 14,
    basePrice: 55,
    issueHint: "Intervenție rapidă"
  }
];

export const STATUS_LABELS = {
  searching: "Căutare șofer",
  confirmed: "Confirmat",
  driver_en_route: "În drum spre tine",
  arrived: "A sosit",
  in_progress: "În cursă",
  completed: "Finalizat",
  cancelled: "Anulat"
} as const;
