import { useEffect } from "react";
import type { ThemePreference } from "@/types/domain";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";

export function useTheme() {
  const theme = useAppStore((state) => state.theme);
  const profile = useAppStore((state) => state.profile);
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const shouldUseDark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", shouldUseDark);
      document.documentElement.dataset.theme = theme;
    };

    applyTheme();
    media.addEventListener("change", applyTheme);

    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);

  const persistTheme = async (nextTheme: ThemePreference) => {
    setTheme(nextTheme);

    if (isSupabaseConfigured && profile?.id) {
      await supabase.from("profiles").update({ theme: nextTheme }).eq("id", profile.id);
    }
  };

  return {
    theme,
    setTheme: persistTheme
  };
}
