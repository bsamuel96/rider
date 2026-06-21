import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/types/domain";
import { cn } from "@/utils/cn";

type CarHeadlightThemeToggleProps = {
  floating?: boolean;
  onToggle?: (theme: ThemePreference) => void;
};

export function CarHeadlightThemeToggle({ floating, onToggle }: CarHeadlightThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const nextTheme: ThemePreference = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label="Schimbă tema"
      aria-pressed={isDark}
      title="Comută între tema deschisă și tema închisă"
      onClick={() => {
        void setTheme(nextTheme);
        onToggle?.(nextTheme);
      }}
      className={cn(
        "map-glass-control relative grid h-11 w-11 place-items-center overflow-hidden text-foreground transition-all duration-150 hover:bg-muted/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        floating && "map-layer-control"
      )}
    >
      <span className="relative grid h-6 w-6 place-items-center">
        <Sun
          className={cn(
            "absolute h-5 w-5 text-amber-500 transition-all duration-300",
            isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          )}
          aria-hidden="true"
        />
        <Moon
          className={cn(
            "absolute h-5 w-5 text-sky-500 transition-all duration-300",
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
          )}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
