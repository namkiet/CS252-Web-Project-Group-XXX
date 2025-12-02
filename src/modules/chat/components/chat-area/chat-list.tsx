import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { ChatMessage } from './chat-message'
import { ChatEmptyState } from './chat-empty-state'
import type { FoodItem, Conversation, ScheduleDay } from '../../types'

interface ChatListProps {
  conversation: Conversation;
  schedule: ScheduleDay[];
  isLoading: boolean;
  onAddToSchedule: (item: FoodItem ,  ) => void;
  foodCardSelected: FoodItem | null ;
  setFoodCardSelected: (item: FoodItem | null) => void ;
}

export function ChatList({ conversation, schedule, isLoading, onAddToSchedule, foodCardSelected,setFoodCardSelected  }: ChatListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {!conversation ? (
        <ChatEmptyState />
      ) : conversation.messages.length === 0 ? (
        <ChatEmptyState />
      ) : (
        <div className="p-4 space-y-6 pb-32">
          {conversation.messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              currentSchedule={schedule}
              onAddToSchedule={onAddToSchedule}
              foodCardSelected={foodCardSelected}
              setFoodCardSelected={setFoodCardSelected}
            />
          ))}

          {isLoading && (
            <div className="pl-12 flex items-center gap-2 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                <Bot size={16} />
              </div>
              <span className="text-sm text-gray-400 italic">AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}