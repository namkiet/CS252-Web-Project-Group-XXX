import React from 'react';
import { MapPin } from 'lucide-react';
import { DishCard } from '../components/dish-card';
import type { LocationData, DishData } from '../index';

interface DishSectionListProps {
  locations: LocationData[];
  allDishes: DishData[];
  onDishClick: (dish: DishData) => void;
}

export const DishSectionList: React.FC<DishSectionListProps> = ({ locations, allDishes, onDishClick }) => {
  
  const getDishesByLocation = (locationName: string) => {
    return allDishes.filter(dish => dish.origin === locationName);
  };

  return (
    <div className="flex-1 min-w-0">
      {locations.map((location) => {
        const locationDishes = getDishesByLocation(location.name);
        if (locationDishes.length === 0) return null;

        return (
          <section 
            key={location.id}
            id={`location-${location.id}`}
            className="mb-16 scroll-mt-40"
          >
            {/* Location Header */}
            <div className="mb-8 border-l-4 border-orange-500 pl-4 py-1">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">{location.name}</h2>
              </div>
              <p className="text-gray-600 text-lg">{location.description}</p>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locationDishes.map((dish) => (
                <DishCard 
                  key={dish.id} 
                  dish={dish}
                  onClick={() => onDishClick(dish)}
                />
              ))}
            </div>
          </section>
        );
      })}
      
      {locations.length === 0 && (
          <div className="text-center py-20 text-gray-500">No data available.</div>
      )}
    </div>
  );
};