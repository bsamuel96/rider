import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type MapTopBarProps = HTMLAttributes<HTMLDivElement> & {
  identity?: ReactNode;
  actions?: ReactNode;
};

export function MapTopBar({ identity, actions, className, children, ...props }: MapTopBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[500] flex items-start justify-between gap-3 md:inset-x-5",
        className
      )}
      {...props}
    >
      {identity && <div className="pointer-events-auto min-w-0">{identity}</div>}
      {children}
      {actions && <div className="pointer-events-auto flex shrink-0 flex-col gap-2">{actions}</div>}
    </div>
  );
}
