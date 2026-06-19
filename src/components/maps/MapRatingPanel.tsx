import { RatingPanel } from "@/components/ratings/RatingPanel";
import type { RatingTag } from "@/types/domain";

type MapRatingPanelProps = {
  roadside?: boolean;
  onRate?: (rating: number) => void;
};

const rideTags: RatingTag[] = ["Curat", "Politicos", "Rapid", "Confortabil", "Sigur"];
const roadsideTags: RatingTag[] = ["Rapid", "Profesionist", "Echipat", "Clar", "Recomand"];

export function MapRatingPanel({ roadside, onRate }: MapRatingPanelProps) {
  return <RatingPanel title="Cum a fost experiența?" tags={roadside ? roadsideTags : rideTags} onSubmit={onRate} />;
}
