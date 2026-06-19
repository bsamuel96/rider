import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface MapFloatingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function MapFloatingButton({ className, active, ...props }: MapFloatingButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "grid min-h-11 min-w-11 place-items-center rounded-2xl border border-border/60 bg-background/85 px-3 text-sm font-semibold shadow-map-control backdrop-blur-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "border-primary bg-primary text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}
