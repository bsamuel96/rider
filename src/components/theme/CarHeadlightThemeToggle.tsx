import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/types/domain";
import { cn } from "@/utils/cn";

type CarHeadlightThemeToggleProps = {
  floating?: boolean;
  onToggle?: (theme: ThemePreference) => void;
};

const labels = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System mode"
};

export function CarHeadlightThemeToggle({ floating, onToggle }: CarHeadlightThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  return (
    <button
      type="button"
      aria-label="Schimbă tema"
      title={`Schimbă tema · ${labels[theme]}`}
      onClick={() => {
        void setTheme(nextTheme);
        onToggle?.(nextTheme);
      }}
      className={cn(
        "relative grid min-h-11 min-w-11 place-items-center overflow-hidden rounded-2xl border border-border/60 bg-background/85 text-foreground shadow-map-control backdrop-blur-xl transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        floating ? "px-3" : "h-10 w-10"
      )}
    >
      <span className="relative grid h-7 w-7 place-items-center">
        <Sun
          className={cn(
            "absolute h-5 w-5 text-amber-500 transition-all duration-200",
            theme === "dark" ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
            theme === "system" && "-translate-x-1.5 scale-75 opacity-80"
          )}
          aria-hidden="true"
        />
        <Moon
          className={cn(
            "absolute h-5 w-5 text-sky-500 transition-all duration-200",
            theme === "light" ? "scale-50 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
            theme === "system" && "translate-x-1.5 scale-75 opacity-80"
          )}
          aria-hidden="true"
        />
      </span>
      {theme === "system" && (
        <span className="absolute right-1 top-1 rounded-md bg-secondary px-1 text-[9px] font-black">SYS</span>
      )}
    </button>
  );
}
