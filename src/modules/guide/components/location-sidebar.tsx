import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationData } from '../index';

interface LocationSidebarProps {
  locations: LocationData[];
  activeLocationId: string;
  activeTab: string;
  onScrollToLocation: (id: string) => void;
}

export const LocationSidebar: React.FC<LocationSidebarProps> = ({ 
  locations, activeLocationId, activeTab, onScrollToLocation 
}) => {
  const { t } = useTranslation();

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="lg:sticky lg:top-[152px]">
        <div className="bg-white lg:rounded-xl lg:shadow-lg lg:p-6 lg:border lg:border-orange-100">
          <h3 className="text-gray-900 mb-4 font-bold text-lg hidden lg:block">
            {activeTab === 'vietnam' ? t('guide.sidebar.provinces') : t('guide.sidebar.countries')}
          </h3>
          <nav className="space-y-1">
            {locations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => onScrollToLocation(location.id)}
                className={`w-full text-left px-4 py-3 lg:py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeLocationId === location.id
                    ? 'bg-orange-100 text-orange-700 font-medium shadow-sm'
                    : 'hover:bg-orange-50 text-gray-700'
                }`}
              >
                <span className="text-orange-600 min-w-[24px] font-bold text-sm">{index + 1}.</span>
                <span className="text-sm lg:text-base">{location.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};