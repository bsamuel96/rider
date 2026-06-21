import { CheckCircle2, Clock3 } from "lucide-react";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { CustomerArrivalConfirmation } from "@/components/roadside/CustomerArrivalConfirmation";
import { CustomerIssueSolvedConfirmation } from "@/components/roadside/CustomerIssueSolvedConfirmation";
import { RoadsideGuaranteeBanner } from "@/components/roadside/RoadsideGuaranteeBanner";
import { RoadsideProgressTimeline } from "@/components/roadside/RoadsideProgressTimeline";
import { RoadsideSpeedSelector } from "@/components/roadside/RoadsideSpeedSelector";
import type { RoadsideGuaranteeStatus } from "@/hooks/useRoadsideGuarantee";
import type { PaymentMethod, RoadsideIssue, RoadsideRequestStatus, RoadsideSpeedTier } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type RoadsideConfirmStepProps = {
  mode: "roadside" | "tow";
  issueType: RoadsideIssue;
  etaMinutes: number;
  amount: number;
  normalPrice: number;
  speedTier: RoadsideSpeedTier;
  guaranteeStatus: RoadsideGuaranteeStatus;
  guaranteeRemainingMinutes: number;
  requestStatus: RoadsideRequestStatus;
  paymentMethod: PaymentMethod;
  submitted: boolean;
  onSpeedTierChange: (tier: RoadsideSpeedTier) => void;
  onPaymentChange: (method: PaymentMethod) => void;
  onConfirmArrival: () => void;
  onNotArrived: () => void;
  onConfirmSolved: () => void;
  onDisputeSolved: () => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function RoadsideConfirmStep({
  mode,
  issueType,
  etaMinutes,
  amount,
  normalPrice,
  speedTier,
  guaranteeStatus,
  guaranteeRemainingMinutes,
  requestStatus,
  paymentMethod,
  submitted,
  onSpeedTierChange,
  onPaymentChange,
  onConfirmArrival,
  onNotArrived,
  onConfirmSolved,
  onDisputeSolved,
  onSubmit,
  onBack
}: RoadsideConfirmStepProps) {
  if (submitted) {
    return (
      <div className="space-y-4">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="text-center">
          <p className="text-base font-semibold">Ajutorul este pe drum.</p>
          <p className="mt-1 text-sm text-muted-foreground">Operatorul poate suna pentru detalii. ETA ~{etaMinutes} min.</p>
        </div>
        <RoadsideGuaranteeBanner status={guaranteeStatus} remainingMinutes={guaranteeRemainingMinutes} />
        <RoadsideProgressTimeline status={requestStatus} />
        {requestStatus === "operator_arrived_pending_customer" && (
          <CustomerArrivalConfirmation onConfirm={onConfirmArrival} onNotArrived={onNotArrived} />
        )}
        {requestStatus === "issue_solved_pending_customer" && (
          <CustomerIssueSolvedConfirmation onConfirm={onConfirmSolved} onDispute={onDisputeSolved} />
        )}
        {requestStatus === "disputed" && (
          <p className="rounded-2xl bg-destructive/12 p-3 text-sm font-semibold text-destructive">
            Am trimis disputa către suport. Un operator va verifica situația.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold">Confirmă solicitarea</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {mode === "tow" ? "Platformă" : "Asistență"} · {issueType.replace("_", " ")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <span className="rounded-xl bg-muted/60 p-3">
          ETA
          <strong className="mt-1 flex items-center gap-1 text-sm">
            <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />~{etaMinutes} min
          </strong>
        </span>
        <span className="rounded-xl bg-muted/60 p-3">
          Cost estimat
          <strong className="mt-1 block text-sm">{formatCurrency(amount)}</strong>
        </span>
      </div>
      <RoadsideSpeedSelector value={speedTier} onChange={onSpeedTierChange} normalPrice={normalPrice} />
      <PaymentMethodSelector value={paymentMethod} onChange={onPaymentChange} fareEstimate={amount} compact />
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 rounded-xl border border-border/60 bg-background/55 px-4 text-sm font-semibold"
        >
          Înapoi
        </button>
        <button type="button" onClick={onSubmit} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
          Trimite solicitarea
        </button>
      </div>
    </div>
  );
}
