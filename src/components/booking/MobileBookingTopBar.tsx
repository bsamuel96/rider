import { ChevronLeft, Clock3 } from "lucide-react";
import type { BookingMobileStep } from "@/components/booking/MobileBookingTypes";

type MobileBookingTopBarProps = {
  step: BookingMobileStep;
  etaMinutes?: number;
  onBack?: () => void;
};

const stepLabels: Record<BookingMobileStep, string> = {
  location: "Alege traseul",
  service: "Alege serviciul",
  payment: "Alege plata",
  review: "Confirmare"
};

export function MobileBookingTopBar({ step, etaMinutes, onBack }: MobileBookingTopBarProps) {
  return (
    <header className="absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[520] md:hidden">
      <div className="glass-panel flex h-[52px] items-center justify-between gap-3 px-3">
        <div className="flex min-w-0 items-center gap-2">
          {onBack && (
            <button
              type="button"
              aria-label="Înapoi"
              onClick={onBack}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">Cursă</p>
            <p className="truncate text-xs text-muted-foreground">{stepLabels[step]}</p>
          </div>
        </div>
        {etaMinutes !== undefined && (
          <span className="glass-chip inline-flex min-h-9 shrink-0 items-center gap-1.5 px-3 text-xs font-semibold">
            <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            ~{etaMinutes} min
          </span>
        )}
      </div>
    </header>
  );
}
