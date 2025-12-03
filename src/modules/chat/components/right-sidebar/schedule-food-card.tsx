import { MapPin, Star, Trash2, Map as MapIcon } from 'lucide-react';
import type { FoodItem } from '../../types';

interface ScheduleFoodCardProps {
  food: FoodItem;
  onRemove?: () => void;
  onShowMap?: (item: FoodItem) => void;
}

export const ScheduleFoodCard = ({ food, onRemove, onShowMap }: ScheduleFoodCardProps) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-orange-200 shadow-sm hover:border-orange-400 hover:shadow-md transition-all group flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        {/* Header (name of food) */}
        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 flex-1 leading-tight" title={food.name}>
          {food.name}
        </h4>

        <div className="flex items-center gap-1 shrink-0">
          {/* Map */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowMap?.(food);
            }}
            className="w-7 h-7 flex items-center justify-center rounded bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
            title="See map"
          >
            <MapIcon className="w-3.5 h-3.5" />
          </button>

          {/* Recycle bin */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      {food.priceRange && (
        <div className="text-xs font-medium text-gray-500">
          {food.priceRange}
        </div>
      )}

      {/* Address and rating */}
      <div className="flex items-end justify-between gap-2 pt-1 mt-auto">
        {food.address && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-900 flex-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            <span className="line-clamp-1">{food.address}</span>
          </div>
        )}

        {food.rating && (
          <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded shrink-0">
            <Star className="w-3 h-3 fill-current" />
            {food.rating}
          </div>
        )}
      </div>
    </div>
  );
};