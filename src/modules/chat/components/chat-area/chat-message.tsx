import { Bot, User } from 'lucide-react'
import type { Message, FoodItem } from '../../types'
import { FoodRecommendationCard } from './food-rec-card'

interface ChatMessageProps {
  message: Message;
  currentSchedule: FoodItem[];
  onAddToSchedule: (item: FoodItem) => void;
}

export function ChatMessage({ message, currentSchedule, onAddToSchedule }: ChatMessageProps) {
  const isAi = message.role === 'ai';

  return (
    <div className={`flex flex-col gap-2 ${!isAi ? 'items-end' : 'items-start'}`}>
      <div className={`flex gap-3 max-w-[90%] ${!isAi ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
          ${isAi ? 'bg-[var(--color-brand)] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {isAi ? <Bot size={16}/> : <User size={16}/>}
        </div>

        <div className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm
          ${!isAi ? 'bg-gray-100 text-gray-900 rounded-tr-none' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
          {message.content}
        </div>
      </div>

      {isAi && message.type === 'recommendation' && message.data && (
        <div className="pl-11 w-full overflow-x-auto pb-4 pt-2">
          <div className="flex gap-4 w-max px-1">
            {message.data.map((place) => {
              const isAdded = currentSchedule.some(i => i.id === place.id);
              
              return (
                <FoodRecommendationCard 
                  key={place.id}
                  item={place}
                  isAdded={isAdded}
                  onToggle={onAddToSchedule}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}