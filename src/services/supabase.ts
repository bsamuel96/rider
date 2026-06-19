import { createClient, hasSupabaseEnv } from "@/utils/supabase/client";

export const isSupabaseConfigured = hasSupabaseEnv;

export const supabase = createClient();
