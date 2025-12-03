import React from 'react';
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
  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-[152px]">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
          <h3 className="text-gray-900 mb-4 font-bold text-lg">
            {activeTab === 'vietnam' ? 'Provinces' : 'Countries'}
          </h3>
          <nav className="space-y-0.5">
            {locations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => onScrollToLocation(location.id)}
                className={`w-full text-left px-4 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeLocationId === location.id
                    ? 'bg-orange-100 text-orange-700 font-medium'
                    : 'hover:bg-orange-50 text-gray-700'
                }`}
              >
                <span className="text-orange-600 min-w-[24px] font-bold">{index + 1}.</span>
                <span>{location.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};