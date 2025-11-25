import { MapPin, ChefHat } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/ui/image-with-fallback';

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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={cuisine.image}
          alt={`${cuisine.name} cuisine`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white mb-1">{cuisine.name}</h3>
          <div className="flex items-center gap-1 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{cuisine.region}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 mb-4 line-clamp-3">{cuisine.description}</p>

        {/* Signature Dishes */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-4 h-4 text-orange-600" />
            <span className="text-gray-900">Signature Dishes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cuisine.signature_dishes.map((dish, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-100"
              >
                {dish}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
