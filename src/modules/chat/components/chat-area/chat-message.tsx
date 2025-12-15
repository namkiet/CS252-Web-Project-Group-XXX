import { Bot, User } from 'lucide-react'
import type { Message, FoodItem, ScheduleDay } from '../../types'
import { FoodRecommendationCard } from './food-card/food-rec-card'

interface ChatMessageProps {
  message: Message;
  currentSchedule: ScheduleDay[];
  onAddToSchedule: (item: FoodItem) => void;
  foodCardSelected: FoodItem | null;
  setFoodCardSelected: (item: FoodItem | null) => void;
  onShowMap: (item: FoodItem) => void;
}

export function ChatMessage({ message, currentSchedule, onAddToSchedule, foodCardSelected, setFoodCardSelected, onShowMap }: ChatMessageProps) {
  const isAi = message.role === 'ai';

  return (
    <div className={`flex flex-col gap-1.5 md:gap-2 ${!isAi ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-2 md:gap-3 max-w-[95%] md:max-w-[85%] ${!isAi ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0
          ${isAi ? 'bg-[var(--color-brand)] text-white' : 'bg-gray-200 text-gray-600'}`}>
          {isAi ? <Bot size={16} className="md:w-4 md:h-4"/> : <User size={16} className="md:w-4 md:h-4"/>}
        </div>

        <div className={`rounded-2xl px-4 py-2.5 md:px-5 md:py-3 text-sm leading-relaxed shadow-sm
          ${!isAi ? 'bg-gray-100 text-gray-900 rounded-tr-none' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
          {message.content}
        </div>
      </div>

      {isAi && message.type === 'recommendation' && message.data && (
        <div className="pl-9 md:pl-11 w-full max-w-2xl pt-1 md:pt-2">
          <div className="flex flex-col gap-3 md:gap-4">
            {message.data.map((place) => {
              // Check whether this item added
              const isAdded = currentSchedule.some(day =>
                day.scheduleInDay.some(i => i.food?.id === place.id)
              );

              // Check whether this card ploging and pluging
              const isDragging = foodCardSelected?.id === place.id;

              return (
                <div
                  key={place.id}
                  draggable
                  onDragStart={(e) => {
                    setFoodCardSelected(place);
                    e.dataTransfer.setData("foodId", place.id);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onDragEnd={() => {
                    setTimeout(() => setFoodCardSelected(null), 100);
                  }}
                  className={`
                    cursor-grab active:cursor-grabbing
                    transition-all duration-300 origin-center
                    ${isDragging 
                      ? 'scale-105 rotate-2 shadow-2xl ring-4 ring-blue-400 ring-opacity-60 z-50' 
                      : 'hover:scale-[1.02] hover:shadow-xl'
                    }
                  `}
                >
                  <FoodRecommendationCard 
                    item={place}
                    isAdded={isAdded}
                    onToggle={() => onAddToSchedule(place)}
                    onShowMap={onShowMap}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}