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
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white mb-1">{dish.name}</h3>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{dish.origin}, {dish.country}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 line-clamp-3 mb-4">{dish.whatIsIt}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-orange-600">Click to learn more →</span>
        </div>
      </div>
    </div>
  );
}
