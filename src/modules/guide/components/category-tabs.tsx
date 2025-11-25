import React from 'react';
import { MapPin, Utensils } from 'lucide-react';

interface CategoryTabsProps {
  activeTab: 'vietnam' | 'international';
  onTabChange: (tab: 'vietnam' | 'international') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-[88px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4">
          <button
            onClick={() => onTabChange('vietnam')}
            className={`px-6 py-3 transition-all duration-200 border-b-2 flex items-center gap-2 ${
              activeTab === 'vietnam'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-orange-500'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Vietnamese Provinces</span>
          </button>
          <button
            onClick={() => onTabChange('international')}
            className={`px-6 py-3 transition-all duration-200 border-b-2 flex items-center gap-2 ${
              activeTab === 'international'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-orange-500'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>International Cuisine</span>
          </button>
        </div>
      </div>
    </div>
  );
};