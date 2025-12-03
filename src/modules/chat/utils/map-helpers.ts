import type { FoodItem, ScheduleDay } from '../types';
import type { MapLocation } from '../components/map-area/simple-map';

const MAP_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

// Convert one card to one location in map
export const convertFoodToLocation = (food: FoodItem, color?: string): MapLocation | null => {
  if (!food.coordinates) return null;
  return {
    id: food.id,
    name: food.name,
    address: food.address,
    lat: food.coordinates.lat,
    lng: food.coordinates.lng,
    image: food.image,
    rating: food.rating,
    description: food.description,
    priceRange: food.priceRange,
    color: color || MAP_COLORS[0]
  };
};

// Convert all schedule on day to some location in map
export const getLocationsFromDay = (daySchedule: ScheduleDay): MapLocation[] => {
  const locations: MapLocation[] = [];
  let colorIndex = 0;

  daySchedule.scheduleInDay.forEach((item) => {
    if (item.food && item.food.coordinates) {
      const assignedColor = MAP_COLORS[colorIndex % MAP_COLORS.length];
      const loc = convertFoodToLocation(item.food, assignedColor);
      if (loc) {
        locations.push(loc);
        colorIndex++;
      }
    }
  });
  return locations;
};