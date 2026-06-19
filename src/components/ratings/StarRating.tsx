import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          onClick={() => onChange(star)}
          className="grid h-10 w-10 place-items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className={cn("h-7 w-7", star <= value ? "fill-primary text-primary" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
}
