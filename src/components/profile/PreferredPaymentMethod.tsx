import { Banknote, CreditCard } from "lucide-react";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { useAppStore } from "@/store/useAppStore";

export function PreferredPaymentMethod() {
  const profile = useAppStore((state) => state.profile);
  const preferredPaymentMethod = useAppStore((state) => state.preferredPaymentMethod);
  const setPreferredPaymentMethod = useAppStore((state) => state.setPreferredPaymentMethod);
  const value = profile?.preferredPaymentMethod || preferredPaymentMethod;

  return (
    <div className="space-y-4">
      <PaymentMethodSelector
        compact
        value={value}
        onChange={(method) => {
          void setPreferredPaymentMethod(method);
        }}
      />
      <div className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
        {value === "card" ? (
          <p className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
            Card principal pregătit
          </p>
        ) : (
          <p className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary" aria-hidden="true" />
            Vei plăti la finalul cursei sau intervenției.
          </p>
        )}
      </div>
    </div>
  );
}
