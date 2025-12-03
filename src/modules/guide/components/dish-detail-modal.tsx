import React from 'react';
import type { DishData } from '../index';
import { MapPin } from 'lucide-react';

interface DishDetailModalProps {
  dish: DishData | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose }) => {
  if (!dish) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image */}
        <div className="relative h-80">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-sm"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-bold text-white mb-2">{dish.name}</h2>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <span className="text-lg font-medium">{dish.origin}, {dish.country}</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">What is it?</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{dish.whatIsIt}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Main Ingredients</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dish.mainIngredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-orange-600 text-xl">•</span>
                  <span className="text-gray-700 font-medium">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">How it's served</h3>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-gray-800 leading-relaxed">
               {dish.servingStyle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};