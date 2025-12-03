import { useEffect, useState, useRef } from 'react';
import { locations } from '../data/location-data';
import { dishes } from '../data/dish-data';
import type { DishData } from '../index';

import { MainHeader } from '../components/main-header';
import { CategoryTabs } from '../components/category-tabs';
import { DishSectionList } from '../components/dish-section-list';
import { LocationSidebar } from '../components/location-sidebar';
import { DishDetailModal } from '../components/dish-detail-modal';

export default function FoodGuidePage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'vietnam' | 'international'>('vietnam');
  const [selectedDish, setSelectedDish] = useState<DishData | null>(null);
  const [activeLocation, setActiveLocation] = useState<string>('');

  // --- LOGIC ---
  const isManualScrolling = useRef(false);
  const filteredLocations = locations.filter(loc => loc.category === activeTab);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const locationId = entry.target.id.replace('location-', '');
            setActiveLocation(locationId);
          }
        });
      },
      {
        root: null,
        rootMargin: '-150px 0px -50% 0px', 
        threshold: 0
      }
    );
    filteredLocations.forEach((loc) => {
      const element = document.getElementById(`location-${loc.id}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [filteredLocations]);

  const handleScrollToLocation = (locationId: string) => {
    isManualScrolling.current = true;
    setActiveLocation(locationId);

    const element = document.getElementById(`location-${locationId}`);
    if (element) {
      const offsetTop = element.offsetTop - 140;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      setActiveLocation(locationId);
    }
    
    setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      
      {/* Header */}
      <MainHeader />

      {/* Tabs */}
      <CategoryTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          
          <DishSectionList 
            locations={filteredLocations}
            allDishes={dishes}
            onDishClick={setSelectedDish}
          />

          <LocationSidebar 
            locations={filteredLocations}
            activeLocationId={activeLocation}
            activeTab={activeTab}
            onScrollToLocation={handleScrollToLocation}
          />
          
        </div>
      </div>

      <DishDetailModal 
        dish={selectedDish} 
        onClose={() => setSelectedDish(null)} 
      />

      <footer className="bg-white border-t border-orange-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            Explore the world one dish at a time 🍜
          </p>
        </div>
      </footer>
      
    </div>
  );
}