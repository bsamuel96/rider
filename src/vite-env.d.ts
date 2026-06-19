/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_MAP_PROVIDER?: "openstreetmap" | "maplibre";
  readonly VITE_NOMINATIM_URL?: string;
  readonly VITE_TILE_URL?: string;
  readonly VITE_DEFAULT_LAT?: string;
  readonly VITE_DEFAULT_LNG?: string;
  readonly VITE_ENABLE_DARK_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
