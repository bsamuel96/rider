import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const createClient = () =>
  createBrowserClient<Database>(
    supabaseUrl || "https://example.supabase.co",
    supabaseKey || "demo-publishable-key"
  );

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseKey);
