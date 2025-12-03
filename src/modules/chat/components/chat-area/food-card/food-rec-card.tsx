import { MapPin, DollarSign, Clock,Plus, Check } from 'lucide-react'
import { ImageWithFallback } from "../../../../../shared/components/ui/image-with-fallback";
import { StarRating } from "./star-rating";
import type { FoodItem } from '../../../types'
import phoImage from '@/assets/images/street-food.jpg'


interface FoodCardProps {
  item: FoodItem,
  isAdded: boolean,
  onToggle: (item: FoodItem) => void;
}

// No code for added button yet! Fix after!
export function FoodRecommendationCard({ item, isAdded, onToggle }: FoodCardProps) {
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
          src={item.image?.trim() ? item.image : phoImage}
          alt={item.name}
          className="
            w-full h-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={(e) => {
            if(!isAdded){
              e.stopPropagation();
              onToggle(item);
            }
          }}
          className={`
            absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center
            shadow-lg transition-all duration-300 transform
            ${isAdded
              ? "bg-green-500 text-white hover:bg-green-600 scale-110"
              : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:scale-110"
            }
          `}
        >
          {isAdded ? (
            <Check className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
        {item.cuisine && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
              {item.cuisine}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-3 flex flex-col min-w-0">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={item.rating} />
                <span className="text-sm text-gray-500">({item.rating}/5.0)</span>
              </div>
            </div>
            {item.priceRange && (
              <div className="flex items-center gap-1 text-gray-700">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">{item.priceRange}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-3 line-clamp-2">{item.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{item.address}</span>
          </div>
          {item.openTime && (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 text-green-500" />
              <span>{item.openTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}