import { CheckCircle2, Clock3 } from "lucide-react";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import type { PaymentMethod, RoadsideIssue } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type RoadsideConfirmStepProps = {
  mode: "roadside" | "tow";
  issueType: RoadsideIssue;
  etaMinutes: number;
  amount: number;
  paymentMethod: PaymentMethod;
  submitted: boolean;
  onPaymentChange: (method: PaymentMethod) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function RoadsideConfirmStep({
  mode,
  issueType,
  etaMinutes,
  amount,
  paymentMethod,
  submitted,
  onPaymentChange,
  onSubmit,
  onBack
}: RoadsideConfirmStepProps) {
  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-base font-semibold">Ajutorul este pe drum.</p>
          <p className="mt-1 text-sm text-muted-foreground">Operatorul poate suna pentru detalii. ETA ~{etaMinutes} min.</p>
        </div>
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
