import { Banknote, CheckCircle2, CreditCard } from "lucide-react";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import type { AddressSuggestion, PaymentMethod, ServiceType } from "@/types/domain";
import { formatCurrency, formatDistance } from "@/utils/format";

type MobileReviewSheetProps = {
  pickup?: AddressSuggestion;
  destination?: AddressSuggestion;
  serviceType: ServiceType;
  paymentMethod: PaymentMethod;
  fareEstimate: number;
  etaMinutes?: number;
  distanceKm?: number;
  canConfirm: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

const serviceLabels: Record<ServiceType, string> = {
  standard: "Standard",
  premium: "Premium",
  tow: "Tractare",
  roadside: "Asistență"
};

export function MobileReviewSheet({
  pickup,
  destination,
  serviceType,
  paymentMethod,
  fareEstimate,
  etaMinutes,
  distanceKm,
  canConfirm,
  onBack,
  onConfirm
}: MobileReviewSheetProps) {
  const PaymentIcon = paymentMethod === "cash" ? Banknote : CreditCard;
  const confirmLabel =
    serviceType === "tow" ? "Confirmă tractarea" : serviceType === "roadside" ? "Solicită asistență" : "Confirmă cursa";

  return (
    <MobileBottomSheet size="medium" className="max-h-[38svh]">
      <div className="space-y-3">
        <div className="space-y-1 text-sm">
          <p className="truncate text-muted-foreground">{pickup?.label || "Locația mea curentă"}</p>
          <p className="truncate font-semibold">{destination?.label || "Destinație nealeasă"}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <span className="min-h-14 rounded-xl bg-muted/60 p-2">
            Cost
            <strong className="mt-1 block truncate text-sm">{formatCurrency(fareEstimate)}</strong>
          </span>
          <span className="min-h-14 rounded-xl bg-muted/60 p-2">
            ETA
            <strong className="mt-1 block truncate text-sm">{etaMinutes ? `~${etaMinutes} min` : "..."}</strong>
          </span>
          <span className="min-h-14 rounded-xl bg-muted/60 p-2">
            Rută
            <strong className="mt-1 block truncate text-sm">{formatDistance(distanceKm)}</strong>
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-muted/55 p-3 text-sm">
          <span className="font-semibold">{serviceLabels[serviceType]}</span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <PaymentIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            {paymentMethod === "cash" ? "Cash" : "Card"} · {formatCurrency(fareEstimate)}
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <button
            type="button"
            onClick={onBack}
            className="min-h-11 rounded-xl border border-border/60 bg-background/55 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Înapoi
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </MobileBottomSheet>
  );
}
