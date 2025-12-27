import { useTranslation } from 'react-i18next';
import { X, MapPin, Star, DollarSign, Map, CheckCircle, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SimpleMap, type MapLocation } from './simple-map';
import { useRoutePlanning } from '../../hooks/use-route-planning';

interface GlobalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: MapLocation[];
  title?: string;
}

export function GlobalMapModal({ isOpen, onClose, locations, title }: GlobalMapModalProps) {
  const { t } = useTranslation();
  const {
    userLocation,
    selectedLocations,
    routeData,
    routeSegments,
    routeError,
    getUserLocation,
    toggleLocation,
    calculateRoute,
    clearRoute,
  } = useRoutePlanning();
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  // Fetch user location when modal opens
  useEffect(() => {
    if (isOpen && !userLocation) {
      getUserLocation();
    }
  }, [isOpen, userLocation, getUserLocation]);

  // Calculate route when selectedLocations change
  useEffect(() => {
    // Always call calculateRoute; hook will auto-clear when none selected
    calculateRoute(locations);
    // Explicitly clear local route info when none selected
    if (selectedLocations.length === 0) {
      setRouteInfo(null);
    }
  }, [selectedLocations, locations, calculateRoute, userLocation]);

  // Update route info when routeData changes
  useEffect(() => {
    if (routeData) {
      const distanceKm = (routeData.distance / 1000).toFixed(2);
      const durationMin = Math.round(routeData.duration / 60);
      setRouteInfo({
        distance: `${distanceKm} km`,
        duration: `${durationMin} min`,
      });
    }
  }, [routeData]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearRoute();
    onClose();
  };

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
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Map className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 leading-tight text-sm md:text-base line-clamp-1">
                {title || t('chat.map.default_title')}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {t('chat.map.location_count', { count: locations.length })}
                </span>
                
                {/* Route Info */}
                {routeInfo && selectedLocations.length > 0 && (
                  <span className="text-xs text-orange-600 font-semibold ml-2 hidden sm:inline">
                    📍 {routeInfo.distance} • ⏱ {routeInfo.duration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={handleClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500 shrink-0"
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
                zoom={selectedLocations.length > 0 ? 13 : (locations.length > 1 ? 13 : 16)}
                className="w-full h-full"
                userLocation={userLocation}
               routeGeometry={routeData?.geometry || null}
               routeSegments={routeSegments || null}
             />
          </div>

          {/* List Section */}
          <div className="w-full lg:w-80 bg-white overflow-y-auto custom-scrollbar shrink-0 h-[45%] lg:h-full order-2 lg:order-2 flex flex-col">
            {/* Route Error */}
            {routeError && (
              <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-xs">
                {routeError}
              </div>
            )}

            {/* Route Info Bar (Mobile) */}
            {routeInfo && selectedLocations.length > 0 && (
              <div className="p-3 bg-orange-50 border-b border-orange-200 sm:hidden">
                <p className="text-xs font-semibold text-orange-800">
                  📍 {routeInfo.distance} • ⏱ {routeInfo.duration}
                </p>
              </div>
            )}

            {/* Locations List */}
            <div className="p-3 space-y-3 flex-1">
              {/* User Location */}
              {userLocation && (
                <div className="border-2 border-blue-300 rounded-xl overflow-hidden bg-blue-50 p-2 lg:p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <span className="text-xs">📍</span>
                    </div>
                    <span className="font-semibold text-sm text-blue-900">My Location</span>
                  </div>
                  <div className="text-xs text-blue-700">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </div>
                </div>
              )}

              {/* Locations */}
              {locations.map((loc) => {
                const isSelected = selectedLocations.includes(loc.id);
                const orderInRoute = isSelected ? selectedLocations.indexOf(loc.id) + 1 : null;

                return (
                  <div 
                    key={loc.id}
                    onClick={() => toggleLocation(loc.id)}
                    className={`group flex lg:block gap-3 border-2 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer p-2 lg:p-0 ${
                      isSelected
                        ? 'border-orange-400 bg-orange-50 shadow-md'
                        : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    
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
                      {/* Order Badge */}
                      {orderInRoute && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {orderInRoute}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="lg:p-3 flex flex-col justify-center min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                          <h4 
                            className={`font-bold text-sm mb-1 line-clamp-1 transition-colors ${
                              isSelected
                                ? 'text-orange-600'
                                : 'text-gray-900 group-hover:text-orange-600'
                            }`}
                            >
                          {loc.restaurant_name}
                          </h4>
                          {/* Toggle Indicator */}
                          <div className="shrink-0">
                            {isSelected ? (
                              <CheckCircle className="w-5 h-5 text-orange-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                      </div>

                      <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-1 lg:mb-2">
                        <MapPin 
                          className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-500"
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
                );
              })}
            </div>

            {/* Clear Route Button */}
            {selectedLocations.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearRoute}
                  className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Clear route
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}