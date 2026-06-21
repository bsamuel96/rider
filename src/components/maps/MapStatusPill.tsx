import { cn } from "@/utils/cn";

type MapStatusPillProps = {
  label: string;
  tone?: "default" | "success" | "warning";
};

export function MapStatusPill({ label, tone = "default" }: MapStatusPillProps) {
  return (
    <span
      className={cn(
        "glass-chip map-layer-control inline-flex min-h-9 items-center px-3 text-xs font-semibold",
        tone === "success" && "border-primary/40 text-primary",
        tone === "warning" && "border-amber-500/30 text-amber-700 dark:text-amber-300"
      )}
    >
      {label}
    </span>
  );
}
