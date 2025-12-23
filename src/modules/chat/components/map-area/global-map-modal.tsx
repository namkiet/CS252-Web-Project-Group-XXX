import { useTranslation } from 'react-i18next';
import { X, MapPin, Star, DollarSign, Map } from 'lucide-react';
import { SimpleMap, type MapLocation } from './simple-map';

interface GlobalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: MapLocation[];
  title?: string;
}

export function GlobalMapModal({ isOpen, onClose, locations, title }: GlobalMapModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    // Background fade
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="
        bg-white rounded-2xl shadow-2xl 
        w-full h-[90vh] md:h-[85vh] max-w-6xl 
        flex flex-col overflow-hidden relative
        animate-in slide-in-from-top-40 fade-in duration-1400 ease-out
      ">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Map className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight text-sm md:text-base line-clamp-1">
                {title || t('chat.map.default_title')}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {t('chat.map.location_count', { count: locations.length })}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Map Section */}
          <div className="relative bg-gray-100 w-full h-[55%] lg:h-full lg:flex-1 order-1 lg:order-1 border-b lg:border-b-0 lg:border-r border-gray-200">
             <SimpleMap 
                locations={locations} 
                zoom={locations.length > 1 ? 13 : 16} 
                className="w-full h-full"
             />
          </div>

          {/* List Section */}
          <div className="w-full lg:w-80 bg-white overflow-y-auto custom-scrollbar shrink-0 h-[45%] lg:h-full order-2 lg:order-2">
            <div className="p-3 space-y-3">
              {locations.map((loc) => (
                <div key={loc.id} className="group flex lg:block gap-3 border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 bg-white cursor-pointer hover:border-blue-200 p-2 lg:p-0">
                  
                  {/* Image */}
                  <div className="relative h-20 w-20 lg:h-32 lg:w-full shrink-0 rounded-lg lg:rounded-none overflow-hidden">
                    <img 
                      src={loc.image || "/placeholder-food.jpg"} 
                      alt={loc.restaurant_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Price Badge */}
                    {loc.priceRange && (
                        <div className="hidden lg:flex absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm items-center gap-0.5">
                           <DollarSign className="w-2.5 h-2.5" /> {loc.priceRange}
                        </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="lg:p-3 flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <h4 
                        className="font-bold text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1"
                        style={{ color: loc.color }}
                        >
                        {loc.restaurant_name}
                        </h4>
                        {/* Mobile Rating */}
                        <div className="lg:hidden flex items-center gap-0.5 text-[10px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                            <Star className="w-2.5 h-2.5 fill-current" /> {loc.star}
                        </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-1 lg:mb-2">
                      <MapPin 
                        className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-500"
                        style={{ color: loc.color, fill: loc.color, fillOpacity: 0.1 }}
                      />
                      <span className="line-clamp-2 leading-tight">{loc.address}</span>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-gray-500 mt-auto">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {loc.star}
                        <span className="mx-1">•</span>
                        <span>{loc.priceRange}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}