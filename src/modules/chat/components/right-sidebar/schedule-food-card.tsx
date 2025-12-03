import { MapPin } from 'lucide-react';
import type { FoodItem } from '../../types';

interface ScheduleFoodCardProps {
  food: FoodItem;
}

export const ScheduleFoodCard = ({ food }: ScheduleFoodCardProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-semibold text-sm text-zinc-900 line-clamp-1">
        {food.name}
      </h3>

      {food.description && (
        <p className="text-xs text-gray-600 line-clamp-2">
          {food.description}
        </p>
      )}

      {food.address && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{food.address}</span>
        </div>
      )}
    </div>
  );
};