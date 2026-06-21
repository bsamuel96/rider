import { Clock3 } from "lucide-react";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import type { PaymentMethod } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type MobilePaymentSheetProps = {
  paymentMethod: PaymentMethod;
  fareEstimate: number;
  etaMinutes?: number;
  onPaymentChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function MobilePaymentSheet({
  paymentMethod,
  fareEstimate,
  etaMinutes,
  onPaymentChange,
  onBack,
  onContinue
}: MobilePaymentSheetProps) {
  return (
    <MobileBottomSheet size="compact" className="max-h-[30svh]">
      <div className="space-y-3">
        <PaymentMethodSelector compact value={paymentMethod} onChange={onPaymentChange} fareEstimate={fareEstimate} />
        <div className="flex items-center justify-between rounded-2xl bg-muted/55 p-3 text-sm">
          <span className="font-semibold">{formatCurrency(fareEstimate)}</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {etaMinutes ? `~${etaMinutes} min` : "ETA în calcul"}
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
            onClick={onContinue}
            className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Vezi confirmarea
          </button>
        </div>
      </div>
    </MobileBottomSheet>
  );
}
