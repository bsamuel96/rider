import type { SupportTicketCategory } from "@/types/domain";
import { cn } from "@/utils/cn";

type SupportCategorySelectorProps = {
  value: SupportTicketCategory;
  onChange: (value: SupportTicketCategory) => void;
};

const categories: Array<{ value: SupportTicketCategory; label: string }> = [
  { value: "ride", label: "Cursă" },
  { value: "roadside", label: "Roadside" },
  { value: "payment", label: "Plată" },
  { value: "cash", label: "Cash" },
  { value: "safety", label: "Siguranță" },
  { value: "vehicle", label: "Vehicul" },
  { value: "documents", label: "Documente" },
  { value: "fleet", label: "Fleet" },
  { value: "app", label: "Aplicație" },
  { value: "account", label: "Cont" },
  { value: "other", label: "Altceva" }
];

export function SupportCategorySelector({ value, onChange }: SupportCategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {categories.map((category) => {
        const selected = category.value === value;
        return (
          <button
            key={category.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(category.value)}
            className={cn(
              "min-h-11 rounded-2xl border px-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md"
                : "border-border/60 bg-background/70 hover:border-primary/40 hover:bg-muted/70"
            )}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
