import { Banknote, CreditCard, Gift, HandCoins, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

type DriverEarningsSummaryProps = {
  total: number;
  cash: number;
  inApp: number;
  tips: number;
  bonuses: number;
};

export function DriverEarningsSummary({ total, cash, inApp, tips, bonuses }: DriverEarningsSummaryProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Card className="p-4 sm:col-span-2 lg:col-span-2">
        <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
        <p className="mt-4 text-sm font-semibold text-muted-foreground">Câștigurile tale</p>
        <p className="mt-1 text-3xl font-semibold">{formatCurrency(total)}</p>
      </Card>
      <EarningMiniCard icon={HandCoins} label="Numerar în mână" value={cash} />
      <EarningMiniCard icon={CreditCard} label="În aplicație" value={inApp} />
      <EarningMiniCard icon={Gift} label="Bonusuri" value={bonuses + tips} />
    </section>
  );
}

type EarningMiniCardProps = {
  icon: typeof Banknote;
  label: string;
  value: number;
};

function EarningMiniCard({ icon: Icon, label, value }: EarningMiniCardProps) {
  return (
    <Card className="p-4">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <p className="mt-3 text-lg font-semibold">{formatCurrency(value)}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
    </Card>
  );
}
