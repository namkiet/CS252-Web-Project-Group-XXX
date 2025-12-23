import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import type { DishData } from '../index';
import { MapPin, X, Plus } from 'lucide-react';
import { useChatContext } from '@/context/chat-context';

interface DishDetailModalProps {
  dish: DishData | null;
  onClose: () => void;
  onPrefillDishToChat?: (dish: DishData, conversationIndex: number) => Promise<void> | void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose, onPrefillDishToChat }) => {
  const { t } = useTranslation();

  const { chatStore } = useChatContext();
  const [showConversationMenu, setShowConversationMenu] = useState(false);

  if (!dish) return null;

  const handleSelectConversation = async (conversationIndex: number) => {
    if (onPrefillDishToChat) {
      await onPrefillDishToChat(dish, conversationIndex);
    }
    setShowConversationMenu(false);
    onClose();
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
                  🍽️ {t('guide.modal.what_is_it')}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {dish.whatIsIt}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  🥕 {t('guide.modal.ingredients')}
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
                  🥢 {t('guide.modal.how_served')}
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-orange-400 text-gray-700 text-sm md:text-base italic leading-relaxed">
                  "{dish.servingStyle}"
              </div>
            </div>

            {/* Action */}
            <div className="space-y-3">
              <button
                onClick={() => setShowConversationMenu(!showConversationMenu)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all"
              >
                ✍️ {t('guide.modal.add_to_chat')}
              </button>

              {showConversationMenu && (
                <div className="bg-white border border-orange-200 rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b border-orange-200">
                    <p className="text-sm font-bold text-orange-900">{t('guide.modal.select_conv')}</p>
                  </div>
                  <div className="divide-y divide-orange-100">
                    <button
                      onClick={() => handleSelectConversation(-1)}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-orange-900 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('guide.modal.add_new_conv')}
                    </button>
                    {chatStore.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-500">{t('guide.modal.no_convs')}</p>
                    ) : (
                      chatStore.map((conversation, convIdx) => (
                        <button
                          key={convIdx}
                          onClick={() => handleSelectConversation(convIdx)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                          {conversation.title || t('guide.modal.conv_index', { index: convIdx + 1 })}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-white md:hidden sticky bottom-0 z-10">
          <button onClick={onClose} className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200">
            {t('guide.modal.close')}
          </button>
        </div>

      </div>
    </div>
  );
};