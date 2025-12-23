import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertFoodToLocation, getLocationsFromDay } from '../utils/map-helpers';
import type { FoodItem, ScheduleDay } from '../types';
import type { MapLocation } from '../components/map-area/simple-map';

export function useMapModal() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [title, setTitle] = useState("");

  // To open map for one restaurant
  const openMap = (item: FoodItem) => {
    const location = convertFoodToLocation(item);
    if (location) {
      setLocations([location]);
      setTitle(item.restaurant_name);
      setIsOpen(true);
    } else {
      console.warn("No coordinates for this location: ", item.restaurant_name);
    }
  };
  
  // To open map for some restaurant in daySchedule
  const openDayMap = (daySchedule: ScheduleDay) => {
    const dayLocations = getLocationsFromDay(daySchedule);

    if(dayLocations.length > 0) {
      setLocations(dayLocations);
      setTitle(t('chat.map.day_title', { day: daySchedule.day }));
      setIsOpen(true);
    } else {
      console.warn(`No location for day ${daySchedule.day}`);
    }
  }

  // To close map
  const closeMap = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    locations,
    title,
    openMap,
    openDayMap,
    closeMap
  };
}