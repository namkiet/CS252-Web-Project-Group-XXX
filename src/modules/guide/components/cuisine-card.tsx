import { MapPin, ChefHat } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/ui/image-with-fallback';

// ... (Giữ nguyên Type)
type CuisineData = {
  id: string;
  name: string;
  region: string;
  description: string;
  signature_dishes: string[];
  image: string;
};

type CuisineCardProps = {
  cuisine: CuisineData;
};

export function CuisineCard({ cuisine }: CuisineCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 h-full flex flex-col">
      {/* Image: Responsive height */}
      <div className="relative h-48 md:h-56 overflow-hidden shrink-0">
        <ImageWithFallback
          src={cuisine.image}
          alt={`${cuisine.name} cuisine`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-bold text-xl mb-1">{cuisine.name}</h3>
          <div className="flex items-center gap-1.5 text-orange-200 text-xs md:text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{cuisine.region}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-600 mb-5 line-clamp-3 text-sm md:text-base flex-1">
            {cuisine.description}
        </p>

        {/* Signature Dishes */}
        <div className="border-t border-gray-50 pt-4 mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-4 h-4 text-orange-600" />
            <span className="text-gray-900 font-semibold text-sm">Signature Dishes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cuisine.signature_dishes.slice(0, 3).map((dish, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium border border-orange-100 truncate max-w-[120px]"
              >
                {dish}
              </span>
            ))}
            {cuisine.signature_dishes.length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{cuisine.signature_dishes.length - 3} more</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};