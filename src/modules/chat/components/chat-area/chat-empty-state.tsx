import { Bot } from 'lucide-react'

export function ChatEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 p-4">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
        <Bot className="w-8 h-8 text-[var(--color-brand)]" />
      </div>
      <p className="text-lg">Start chatting to plan your food tour!</p>
    </div>
  )
}