import { MapPin, Star, Plus, Check } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { FoodItem } from '../types'

interface FoodCardProps {
  item: FoodItem,
  isAdded: boolean,
  onToggle: (item: FoodItem) => void;
}

export function FoodRecommendationCard({ item, isAdded, onToggle }: FoodCardProps) {
  return (
    <div className="snap-start min-w-[260px] w-[260px] bg-white border rounded-xl
    shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
      <div className="relative h-36 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center text-xs font-bold text-orange-500 shadow-sm">
          <Star className="w-3 h-3 fill-current mr-1" />
          {item.rating}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-bold text-gray-900 text-base truncate" title={item.name}>
          {item.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center text-xs text-gray-500 mb-2 mt-1">
          <MapPin className="w-3 h-3 mr-1 shrink-0" /> 
          <span className="truncate">{item.address}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-4 min-h-[2.5em]">
          {item.description}
        </p>

        {/* Add to Schedule */}
        <Button 
          size="sm" 
          variant={isAdded ? "outline" : "default"}
          className={`w-full mt-auto rounded-lg transition-all font-medium ${
            isAdded 
              ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700" 
              : "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand)]/90"
          }`}
          onClick={() => onToggle(item)}
          >
          {isAdded ? (<> <Check className="w-4 h-4 mr-1" /> Added </>) : (<> <Plus className="w-4 h-4 mr-1" /> Add to Schedule </>)}
        </Button>
          
      </div>
    </div>
  )
}