import { useState } from "react";
import { RatingTagSelector } from "@/components/ratings/RatingTagSelector";
import { StarRating } from "@/components/ratings/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { RatingDraft, RatingTag } from "@/types/domain";

type DriverCustomerRatingPanelProps = {
  customerName: string;
  onSubmit: (rating: RatingDraft) => void;
};

const driverRatingTags: RatingTag[] = ["La timp", "Locație clară", "Politicos", "Problemă plată", "Nu s-a prezentat"];

export function DriverCustomerRatingPanel({ customerName, onSubmit }: DriverCustomerRatingPanelProps) {
  const [value, setValue] = useState(5);
  const [selectedTags, setSelectedTags] = useState<RatingTag[]>([]);
  const [comment, setComment] = useState("");

  const toggleTag = (tag: RatingTag) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Evaluează clientul</h2>
        <p className="mt-1 text-sm text-muted-foreground">Feedback rapid pentru {customerName}.</p>
      </div>

      <StarRating value={value} onChange={setValue} />
      <RatingTagSelector tags={driverRatingTags} selected={selectedTags} onToggle={toggleTag} />

      <Textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Observații opționale"
        aria-label="Observații opționale despre client"
      />

      <Button
        type="button"
        className="w-full"
        onClick={() =>
          onSubmit({
            value,
            tags: selectedTags,
            comment: comment.trim() || undefined
          })
        }
      >
        Trimite evaluarea
      </Button>
    </div>
  );
}
