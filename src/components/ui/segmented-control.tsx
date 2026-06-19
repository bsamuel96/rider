import { cn } from "@/utils/cn";

type SegmentedOption<T extends string> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel
}: SegmentedControlProps<T>) {
  return (
    <div className="grid grid-cols-3 rounded-lg border bg-muted p-1" role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          className={cn(
            "h-9 rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === option.value && "bg-background text-foreground shadow-sm"
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
