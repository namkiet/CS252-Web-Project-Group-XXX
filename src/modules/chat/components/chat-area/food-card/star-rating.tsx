import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
