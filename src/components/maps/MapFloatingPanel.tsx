import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function MapFloatingPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel map-layer-panel p-4 text-foreground",
        className
      )}
      {...props}
    />
  );
}
