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
        "map-glass-control map-layer-control grid min-h-11 min-w-11 place-items-center px-3 text-sm font-semibold text-foreground transition-all duration-150 hover:bg-muted/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:scale-100 disabled:opacity-50",
        active && "border-primary bg-primary text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}
