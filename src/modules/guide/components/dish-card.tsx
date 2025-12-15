import { MapPin } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/ui/image-with-fallback';

type DishData = {
  id: string;
  name: string;
  origin: string;
  country: string;
  category: 'vietnam' | 'international';
  whatIsIt: string;
  mainIngredients: string[];
  servingStyle: string;
  image: string;
};

type DishCardProps = {
  dish: DishData;
  onClick: () => void;
};

export function DishCard({ dish, onClick }: DishCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden shrink-0">
        <ImageWithFallback
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-bold text-lg md:text-xl mb-1 line-clamp-1">{dish.name}</h3>
          <div className="flex items-center gap-1.5 text-orange-200 text-xs md:text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{dish.origin}, {dish.country}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <p className="text-gray-600 text-sm md:text-base line-clamp-3 mb-4 flex-1 leading-relaxed">{dish.whatIsIt}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-orange-600">Click to learn more →</span>
        </div>
      </div>
    </div>
  );
}
