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
      hover:shadow-xl
      hover:-translate-y-1
      overflow-hidden hover:shadow-md transition-all duration-300 flex flex-row h-40 w-full
    ">
      <div className="relative w-44 h-full flex-shrink-0 overflow-hidden">
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
          <div className="absolute top-4 left-4">
            <span className="bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {item.dish_name}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-3 flex flex-col min-w-0 relative">
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          
          {/* Map Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowMap?.(item); 
            }}
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              bg-orange-50 border border-orange-200 text-orange-500 
              hover:bg-orange-500 hover:border-orange-500 hover:text-white
              hover:scale-110 hover:shadow-md
              transition-all duration-300
            "
            title="See map"
          >
            <MapIcon className="w-4 h-4" />
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
              w-8 h-8 rounded-full flex items-center justify-center
              border transition-all duration-300 transform
              ${isAdded
                ? "bg-green-500 border-green-500 text-white hover:bg-green-600 scale-110 shadow-md"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-white hover:border-blue-400 hover:text-blue-500 hover:scale-110 hover:shadow-sm"
              }
            `}
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>

        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="mb-1 font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">{item.restaurant_name}</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={item.star} />
                <span className="text-sm text-gray-500">({item.star}/5.0)</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-3 line-clamp-2">{item.desc}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{item.address}</span>
          </div>
         
          {item.openTime && (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 text-green-500" />
              <span>{item.openTime}</span>
            </div>
          )}

          {item.priceRange && (
            <div className="ml-auto flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-1 rounded font-medium border border-orange-200">
              <DollarSign className="w-3 h-3 text-orange-500" />
              <span className="text-sm">{item.priceRange}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}