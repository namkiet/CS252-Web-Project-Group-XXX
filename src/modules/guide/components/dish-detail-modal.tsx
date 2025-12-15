import React, { useState } from 'react';
import type { DishData, SuggestedRestaurant } from '../index';
import { MapPin, X, Plus, Check } from 'lucide-react';
import { useChatContext } from '@/context/chat-context';
import type { FoodItem } from '@/modules/chat/types';

interface DishDetailModalProps {
  dish: DishData | null;
  onClose: () => void;
  onAddRestaurant?: (restaurant: SuggestedRestaurant, conversationIndex: number) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose, onAddRestaurant }) => {
  const { chatStore } = useChatContext();
  const [selectedRestaurant, setSelectedRestaurant] = useState<SuggestedRestaurant | null>(null);
  const [addedRestaurant, setAddedRestaurant] = useState<string | null>(null);

  if (!dish) return null;

  const handleAddRestaurant = async (restaurant: SuggestedRestaurant, conversationIndex: number) => {
    const conversation = chatStore[conversationIndex];
    if (!conversation) return;

    // Call the callback if provided (parent handles everything: switch conversation, load messages, add to schedule)
    if (onAddRestaurant) {
      await onAddRestaurant(restaurant, conversationIndex);
    }
    
    // Show success feedback
    setAddedRestaurant(restaurant.restaurantName);
    setSelectedRestaurant(null);
    
    // Close modal after brief delay
    setTimeout(() => {
      onClose();
      setAddedRestaurant(null);
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable Container */}
        <div className="overflow-y-auto custom-scrollbar">
            
          {/* Modal Image Header */}
          <div className="relative h-64 md:h-72 shrink-0">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-5 left-5 right-5">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{dish.name}</h2>
              <div className="flex items-center gap-2 text-orange-200 font-medium bg-black/30 backdrop-blur-sm w-fit px-3 py-1 rounded-full text-sm">
                <MapPin className="w-4 h-4" />
                <span>{dish.origin}, {dish.country}</span>
              </div>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  🍽️ What is it?
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {dish.whatIsIt}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  🥕 Main Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.mainIngredients.map((ingredient, index) => (
                  <span 
                      key={index} 
                      className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-orange-100"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  🥢 How it's served
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-orange-400 text-gray-700 text-sm md:text-base italic leading-relaxed">
                  "{dish.servingStyle}"
              </div>
            </div>

            {dish.suggestedRestaurants && dish.suggestedRestaurants.length > 0 && (
              <div className="space-y-3 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    🏪 Suggested Restaurants
                </h3>
                <div className="space-y-4">
                  {dish.suggestedRestaurants.map((restaurant, index) => (
                    <div key={index}>
                      <div 
                        className="bg-gradient-to-br from-white to-orange-50 border border-orange-200 rounded-2xl p-4 hover:border-orange-400 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedRestaurant(selectedRestaurant?.restaurantName === restaurant.restaurantName ? null : restaurant)}
                      >
                        <div className="flex gap-4 items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            <img 
                              src={restaurant.image} 
                              alt={restaurant.dishName}
                              className="w-24 h-24 rounded-xl object-cover shrink-0 shadow-md"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-base mb-1">{restaurant.dishName}</h4>
                              <p className="text-sm text-orange-600 font-semibold mb-1">{restaurant.restaurantName}</p>
                              <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">{restaurant.address}</span>
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-base font-bold text-orange-600">
                                  {restaurant.price.toLocaleString('vi-VN')} ₫
                                </span>
                                {restaurant.rating > 0 && (
                                  <span className="text-sm text-amber-500 font-medium">
                                    ⭐ {restaurant.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Add Button */}
                          <button
                            onClick={() => setSelectedRestaurant(selectedRestaurant?.restaurantName === restaurant.restaurantName ? null : restaurant)}
                            className={`rounded-full p-3 transition-all shadow-lg hover:shadow-xl hover:scale-110 shrink-0 text-white font-bold ${
                              addedRestaurant === restaurant.restaurantName
                                ? 'bg-green-500'
                                : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                            title="Add to schedule"
                          >
                            {addedRestaurant === restaurant.restaurantName ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Dropdown Menu - Below Card */}
                      {selectedRestaurant?.restaurantName === restaurant.restaurantName && (
                        <div className="mt-2 bg-white border border-orange-200 rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                          <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b border-orange-200">
                            <p className="text-sm font-bold text-orange-900">📍 Select conversation to add</p>
                          </div>
                          {chatStore.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500">No conversations available</p>
                          ) : (
                            <div className="divide-y divide-orange-100">
                              {chatStore.map((conversation, convIdx) => (
                                <button
                                  key={convIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddRestaurant(restaurant, convIdx);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors font-medium flex items-center gap-2"
                                >
                                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                  {conversation.title || `Conversation ${convIdx + 1}`}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-white md:hidden sticky bottom-0 z-10">
          <button onClick={onClose} className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};