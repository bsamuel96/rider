import { useState } from "react";
import type { RatingDraft, RatingTag } from "@/types/domain";

export function useRatingSubmission(defaultValue = 5) {
  const [rating, setRating] = useState(defaultValue);
  const [tags, setTags] = useState<RatingTag[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: RatingTag) => {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  const submitRating = () => {
    const draft: RatingDraft = {
      value: rating,
      tags,
      comment
    };
    setSubmitted(true);
    return draft;
  };

  return {
    rating,
    setRating,
    tags,
    toggleTag,
    comment,
    setComment,
    submitted,
    submitRating
  };
}
