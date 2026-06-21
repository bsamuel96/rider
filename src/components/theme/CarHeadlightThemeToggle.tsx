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
        "map-glass-control relative grid h-11 w-11 place-items-center overflow-hidden text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        floating && "map-layer-control"
      )}
    >
      <svg className="h-8 w-8" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <path
          d="M16 31c1.6-8.2 6.8-13 16-13s14.4 4.8 16 13l2.2 11.4A6.3 6.3 0 0 1 44 50H20a6.3 6.3 0 0 1-6.2-7.6L16 31Z"
          className="fill-secondary stroke-border transition-colors"
          strokeWidth="2"
        />
        <path
          d="M22.5 31.5h19L39 25.8c-.8-1.8-2.4-2.8-4.4-2.8h-5.2c-2 0-3.6 1-4.4 2.8l-2.5 5.7Z"
          className="fill-background/90 stroke-border transition-colors"
          strokeWidth="2"
        />
        <path
          d="M18 39h28"
          className="stroke-muted-foreground/45 transition-colors"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <circle
          cx="23"
          cy="42"
          r="4"
          className={cn("transition-colors", isDark ? "fill-amber-300" : "fill-muted-foreground/30")}
        />
        <circle
          cx="41"
          cy="42"
          r="4"
          className={cn("transition-colors", isDark ? "fill-amber-300" : "fill-muted-foreground/30")}
        />
        <path
          d="M10 43 2 48m52-5 8 5M10 37 1 37m53 0h9"
          className={cn(
            "transition-all duration-300",
            isDark ? "stroke-amber-300 opacity-90" : "stroke-amber-200 opacity-0"
          )}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    </button>
  );
}
