import { useRef, useState, useLayoutEffect } from 'react'
import { Bot } from 'lucide-react'
import { ChatMessage } from './chat-message'
import { ChatEmptyState } from './chat-empty-state'
import type { FoodItem, Conversation, ScheduleDay } from '../../types'
import { VietnamLoader } from '@/shared/components/ui/vietnam-loader'
import { useChatContext } from '@/context/chat-context'

interface ChatListProps {
  conversation: Conversation;
  schedule: ScheduleDay[];
  isLoading: boolean;
  onAddToSchedule: (item: FoodItem ,  ) => void;
  foodCardSelected: FoodItem | null;
  setFoodCardSelected: (item: FoodItem | null) => void;
  onShowMap: (item: FoodItem) => void;
}

export function ChatList({ conversation, schedule, isLoading, onAddToSchedule, foodCardSelected, setFoodCardSelected, onShowMap }: ChatListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { loadMoreMessages, currentIdChat, isLoadingMessages } = useChatContext()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleScroll = async () => {
    const el = messagesEndRef.current
    if (!el) return

    if (el.scrollTop < 50 && !isLoadingMore && (conversation as any).hasMore && conversation?.messages.length > 0) {
      setIsLoadingMore(true)
      const oldScrollHeight = el.scrollHeight
      const oldScrollTop = el.scrollTop

      const hasNewData = await loadMoreMessages(currentIdChat)

      if (hasNewData) {
        requestAnimationFrame(() => {
          if (messagesEndRef.current) {
            const newScrollHeight = messagesEndRef.current.scrollHeight
            const heightDifference = newScrollHeight - oldScrollHeight

            messagesEndRef.current.scrollTop = heightDifference + oldScrollTop
          }
        })
      }
      setIsLoadingMore(false)
    }
  }

  useLayoutEffect(() => {
    if (!isLoadingMore && messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [conversation?.id, conversation?.messages?.length, isLoadingMore])

  if (isLoadingMessages && (!conversation || conversation.messages.length === 0)) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50/50 h-full">
        <VietnamLoader />
      </div>
    )
  }

  return (
    <div 
      ref={messagesEndRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto custom-scrollbar relative bg-gray-50/30"
    >
      {isLoadingMore && (
        <div className="w-full flex justify-center py-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-white/80 to-transparent">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {isLoadingMore && <div className="h-6" />}

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
              onShowMap={onShowMap}
            />
          ))}

          {isLoading && (
            <div className="pl-10 md:pl-12 flex items-center gap-2 animate-pulse">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                <Bot size={16} className="w-4 h-4"/>
              </div>
              <span className="text-xs md:text-sm text-gray-400 italic">AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}