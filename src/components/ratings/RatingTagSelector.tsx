import type { RatingTag } from "@/types/domain";
import { cn } from "@/utils/cn";

type RatingTagSelectorProps = {
  tags: RatingTag[];
  selected: RatingTag[];
  onToggle: (tag: RatingTag) => void;
};

export function RatingTagSelector({ tags, selected, onToggle }: RatingTagSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onToggle(tag)}
          className={cn(
            "min-h-9 rounded-xl border px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected.includes(tag) ? "border-primary bg-primary text-primary-foreground" : "bg-background/70"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
