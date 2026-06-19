import { CarFront } from "lucide-react";
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
  const headlightsOn = theme === "dark";

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
        "relative grid min-h-11 min-w-11 place-items-center overflow-hidden rounded-2xl border border-border/60 bg-background/85 text-foreground shadow-map-control backdrop-blur-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        floating ? "px-3" : "h-10 w-10"
      )}
    >
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-10 w-20 -translate-y-1/2 rounded-full bg-primary/0 blur-md transition-all",
          headlightsOn && "bg-primary/25"
        )}
        aria-hidden="true"
      />
      <span className="relative flex items-center gap-1">
        <span
          className={cn(
            "h-1.5 w-5 rounded-full bg-muted transition-all",
            headlightsOn && "translate-x-1 bg-primary shadow-[0_0_18px_hsl(var(--primary))]"
          )}
          aria-hidden="true"
        />
        <CarFront className="h-5 w-5" />
        <span
          className={cn(
            "h-1.5 w-5 rounded-full bg-muted transition-all",
            headlightsOn && "-translate-x-1 bg-primary shadow-[0_0_18px_hsl(var(--primary))]"
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
