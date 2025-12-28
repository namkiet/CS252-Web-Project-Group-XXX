import { MapPin, DollarSign, Clock, Plus, Check, Map as MapIcon } from 'lucide-react'
import { ImageWithFallback } from "../../../../../shared/components/ui/image-with-fallback";
import { StarRating } from "./star-rating";
import type { FoodItem } from '../../../types'

interface FoodCardProps {
  item: FoodItem,
  isAdded: boolean,
  onToggle: (item: FoodItem) => void;
  onShowMap?: (item: FoodItem) => void;
}

export function FoodRecommendationCard({ item, isAdded, onToggle, onShowMap }: FoodCardProps) {
  return (
    <div className="group
      bg-white rounded-xl border border-gray-200
      transition-all duration-300 ease-out
      hover:shadow-xl hover:-translate-y-1 overflow-hidden
      flex flex-col sm:flex-row 
      w-full h-auto sm:h-40
    ">
      <div className="relative w-full sm:w-44 h-32 sm:h-full flex-shrink-0 overflow-hidden">
        <ImageWithFallback
          src={item.image}
          alt={item.restaurant_name}
          className="
            w-full h-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
        />
        <div className="
          absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0
          group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {item.dish_name && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <span className="bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium shadow-sm">
              {item.dish_name}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-2.5 sm:p-3 flex flex-col min-w-0 relative">
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 flex items-center gap-1.5 sm:gap-2">
          
          {/* Map Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowMap?.(item); 
            }}
            className="
              w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
              bg-orange-50 border border-orange-200 text-orange-500 
              hover:bg-orange-500 hover:border-orange-500 hover:text-white
              hover:scale-110 hover:shadow-md
              transition-all duration-300
            "
            title="See map"
          >
            <MapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Add/Check Button */}
          <button
            onClick={(e) => {
              if(!isAdded){
                e.stopPropagation();
                onToggle(item);
              }
            }}
            className={`
              w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
              border transition-all duration-300 transform
              ${isAdded
                ? "bg-green-500 border-green-500 text-white hover:bg-green-600 scale-110 shadow-md"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-white hover:border-blue-400 hover:text-blue-500 hover:scale-110 hover:shadow-sm"
              }
            `}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>

        <div>
          <div className="flex items-start justify-between mb-1 sm:mb-3">
            <div className="pr-16 sm:pr-24">
              <h3 className="mb-0.5 sm:mb-1 font-semibold text-sm sm:text-base text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">{item.restaurant_name}</h3>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <StarRating rating={item.star} />
                <span className="text-[10px] sm:text-sm text-gray-500">
                  ({Number(item.star).toFixed(1)}/5.0)
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2">{item.desc}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
            <span className='truncate text-[10px] sm:text-sm'>{item.address}</span>
          </div>
         
          {item.openTime && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span className='truncate max-w-[80px] sm:max-w-[100px] text-[10px] sm:text-sm'>{item.openTime}</span>
            </div>
          )}

          {item.priceRange && (
            <div className="ml-auto flex items-center gap-0.5 sm:gap-1 text-orange-700 bg-orange-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-medium border border-orange-200">
              <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
              <span className="text-[10px] sm:text-sm">{item.priceRange}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}