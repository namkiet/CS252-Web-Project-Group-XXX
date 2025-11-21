import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { ChatMessage } from './chat-message'
import { ChatEmptyState } from './chat-empty-state'
import type { Message, FoodItem } from '../../types'

interface ChatListProps {
  messages: Message[];
  schedule: FoodItem[];
  isLoading: boolean;
  onAddToSchedule: (item: FoodItem) => void;
}

export function ChatList({ messages, schedule, isLoading, onAddToSchedule }: ChatListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {messages.length === 0 ? (
        <ChatEmptyState />
      ) : (
        <div className="p-4 space-y-6 pb-32">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              currentSchedule={schedule}
              onAddToSchedule={onAddToSchedule}
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