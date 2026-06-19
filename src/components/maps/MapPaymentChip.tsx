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

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border/60 bg-background/85 px-3 text-sm font-semibold shadow-map-control backdrop-blur-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Schimbă metoda de plată"
    >
      <Icon className="h-4 w-4 text-primary" />
      {label} · {formatCurrency(fareEstimate)}
      {cashEnabled && <span className="text-xs text-muted-foreground">de încasat</span>}
    </button>
  );
}
