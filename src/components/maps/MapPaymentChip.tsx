import { Banknote, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type MapPaymentChipProps = {
  paymentMethod?: PaymentMethod;
  fareEstimate?: number;
  cashEnabled?: boolean;
  onClick?: () => void;
};

export function MapPaymentChip({ paymentMethod = "card", fareEstimate = 42, cashEnabled, onClick }: MapPaymentChipProps) {
  const Icon = paymentMethod === "cash" ? Banknote : CreditCard;
  const label = paymentMethod === "cash" ? "Cash" : "Card";
  const content = (
    <>
      <Icon className="h-4 w-4 text-primary" />
      {label} · {formatCurrency(fareEstimate)}
      {cashEnabled && <span className="text-xs text-muted-foreground">de încasat</span>}
    </>
  );
  const className =
    "glass-chip map-layer-control inline-flex min-h-11 items-center gap-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (!onClick) {
    return <span className={className}>{content}</span>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} hover:bg-muted/80`}
      aria-label="Schimbă metoda de plată"
    >
      {content}
    </button>
  );
}
