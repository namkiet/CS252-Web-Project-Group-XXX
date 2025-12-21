import { MapPin, Star, Trash2, Map as MapIcon, Repeat } from 'lucide-react';
import type { FoodItem } from '../../types';

interface ScheduleFoodCardProps {
  food: FoodItem;
  onRemove?: () => void;
  onShowMap?: (item: FoodItem) => void;
  isSwapMode?: boolean;
  isSelected?: boolean;
  onSwap?: () => void;
  isSwapping?: boolean;
}

export const ScheduleFoodCard = ({
  food,
  onRemove,
  onShowMap,
  isSwapMode = false,
  isSelected = false,
  onSwap,
  isSwapping = false,
}: ScheduleFoodCardProps) => {
  return (
    <div
      className="relative bg-white p-2.5 md:p-3 rounded-lg border border-orange-200 shadow-sm hover:border-orange-400 hover:shadow-md transition-all duration-300 group flex flex-col gap-1.5"
      style={isSwapping ? { animation: 'swapPulse 0.85s ease-out' } : undefined}
    >
      <style>{`
        @keyframes swapPulse {
          0% { transform: scale(0.98) rotate(-0.3deg); box-shadow: 0 0 0 rgba(249, 115, 22, 0); }
          50% { transform: scale(1.03) rotate(0.3deg); box-shadow: 0 10px 24px -12px rgba(249, 115, 22, 0.55); }
          100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(249, 115, 22, 0); }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      {isSwapping && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/60 to-transparent"
            style={{ animation: 'shimmerSlide 1s linear' }}
          />
        </div>
      )}
        <div className="flex items-start justify-between gap-2">
        {/* Header (name of food) */}
        <h4 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-1 flex-1 leading-tight" title={food.restaurant_name}>
          {food.restaurant_name}
        </h4>

        <div className="flex items-center gap-1 shrink-0">
          {/* Swap button - only show when in swap mode and not selected */}
          {isSwapMode && !isSelected && onSwap && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwap();
              }}
              className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
              title="Swap with selected"
            >
              <Repeat className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          )}
          
          {/* Map */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowMap?.(food);
            }}
            className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
            title="See map"
          >
            <MapIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
          </button>

          {/* Recycle bin */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-900 min-w-0">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{food.address}</span>
          </div>
        )}

        {food.star && (
          <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded shrink-0">
            <Star className="w-3 h-3 fill-current" />
            {food.star}
          </div>
        )}
      </div>
    </div>
  );
};