import { CheckCircle2 } from "lucide-react";
import { useRatingSubmission } from "@/hooks/useRatingSubmission";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import { StarRating } from "@/components/ratings/StarRating";
import { RatingTagSelector } from "@/components/ratings/RatingTagSelector";
import type { RatingTag } from "@/types/domain";

type RatingPanelProps = {
  title: string;
  tags: RatingTag[];
  onSubmit?: (rating: number) => void;
};

export function RatingPanel({ title, tags, onSubmit }: RatingPanelProps) {
  const rating = useRatingSubmission();

  if (rating.submitted) {
    return (
      <MapFloatingPanel className="text-center">
        <CheckCircle2 className="mx-auto h-6 w-6 text-primary" />
        <p className="mt-2 text-sm font-semibold">Mulțumim pentru evaluare.</p>
      </MapFloatingPanel>
    );
  }

  return (
    <MapFloatingPanel className="space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <StarRating value={rating.rating} onChange={rating.setRating} />
      <RatingTagSelector tags={tags} selected={rating.tags} onToggle={rating.toggleTag} />
      <Textarea
        value={rating.comment}
        onChange={(event) => rating.setComment(event.target.value)}
        placeholder="Comentariu opțional"
        className="min-h-20 bg-background/70"
      />
      <Button
        className="w-full"
        onClick={() => {
          rating.submitRating();
          onSubmit?.(rating.rating);
        }}
      >
        Trimite evaluarea
      </Button>
    </MapFloatingPanel>
  );
}
