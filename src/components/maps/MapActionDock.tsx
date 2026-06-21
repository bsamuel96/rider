import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

type MapActionDockProps = {
  primaryLabel: string;
  onPrimaryAction?: () => void;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  expanded?: boolean;
  payment?: ReactNode;
  secondaryActions?: ReactNode;
  className?: string;
};

export function MapActionDock({
  primaryLabel,
  onPrimaryAction,
  disabled,
  loading,
  compact,
  expanded,
  payment,
  secondaryActions,
  className
}: MapActionDockProps) {
  return (
    <div
      className={cn(
        "glass-dock map-layer-dock space-y-3 p-3",
        compact && "space-y-2 p-2",
        expanded && "p-4",
        className
      )}
    >
      {(payment || secondaryActions) && (
        <div className="flex min-w-0 items-center justify-between gap-2">
          {payment && <div className="min-w-0">{payment}</div>}
          {secondaryActions && <div className="flex shrink-0 items-center gap-2">{secondaryActions}</div>}
        </div>
      )}
      <button
        type="button"
        onClick={onPrimaryAction}
        disabled={disabled || loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {primaryLabel}
      </button>
    </div>
  );
}
