import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function MapFloatingPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-background/85 p-4 shadow-floating backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
