import { ChevronRight } from "lucide-react";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/format";

type DriverEarningsBreakdownSheetProps = {
  open: boolean;
  onClose: () => void;
};

const sections = [
  {
    title: "Venituri în aplicație",
    rows: [
      ["Plăți pentru curse", 286],
      ["Campanii", 66],
      ["Taxe de anulare", 12],
      ["Bacșiș", 24]
    ]
  },
  {
    title: "Venituri în numerar",
    rows: [
      ["Plăți pentru curse", 154],
      ["Reduceri în numerar pentru pasageri", -18]
    ]
  },
  {
    title: "Costuri și taxe",
    rows: [
      ["Comision", -74],
      ["Taxe operaționale", -9]
    ]
  }
];

export function DriverEarningsBreakdownSheet({ open, onClose }: DriverEarningsBreakdownSheetProps) {
  const { toast } = useToast();

  if (!open) {
    return null;
  }

  return (
    <MinimizableBottomSheet
      title="Defalcarea câștigurilor"
      description="Toate rândurile sunt demo și pot deschide detalii."
      initialState="expanded"
      dismissible
      onStateChange={(state) => state === "closed" && onClose()}
      minimizedLabel="Defalcare câștiguri"
    >
      <div className="space-y-5">
        {sections.map((section) => (
          <section key={section.title}>
            <h3 className="text-sm font-semibold">{section.title}</h3>
            <div className="mt-2 divide-y divide-border/60 rounded-2xl border border-border/60 bg-muted/35">
              {section.rows.map(([label, amount]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    toast({
                      title: "Detaliu demo",
                      description: `${label}: ${formatCurrency(amount as number)}`,
                      tone: "default"
                    })
                  }
                  className="flex min-h-12 w-full items-center justify-between gap-3 px-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{label}</span>
                  <span className="flex items-center gap-2 font-semibold">
                    {formatCurrency(amount as number)}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
        <section className="rounded-2xl bg-primary/12 p-4">
          <div className="flex justify-between gap-3 text-sm">
            <span>Câștigurile tale</span>
            <strong>{formatCurrency(421)}</strong>
          </div>
          <div className="mt-2 flex justify-between gap-3 text-sm">
            <span>Numerar în mână</span>
            <strong>{formatCurrency(136)}</strong>
          </div>
        </section>
      </div>
    </MinimizableBottomSheet>
  );
}
