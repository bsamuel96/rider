import { Banknote, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/types/domain";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

type PaymentMethodChipProps = {
  method: PaymentMethod;
  amount: number;
  onToggle?: () => void;
  className?: string;
};

export function PaymentMethodChip({ method, amount, onToggle, className }: PaymentMethodChipProps) {
  const Icon = method === "cash" ? Banknote : CreditCard;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border/60 bg-background/85 px-3 text-sm font-semibold shadow-map-control backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label="Schimbă metoda de plată"
    >
      <Icon className="h-4 w-4 text-primary" />
      {method === "cash" ? "Cash" : "Card"} · {formatCurrency(amount)}
    </button>
  );
}
