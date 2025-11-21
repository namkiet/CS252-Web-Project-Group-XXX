import { useState, useEffect, useRef } from 'react'
import { Send, Bot, Trash2 } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { SidebarLeft } from '../components/user-sidebar'
import { ScheduleSidebar } from '../components/schedule-sidebar'
import { ChatMessage } from '../components/chat-message'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"

import type { FoodItem, Message } from '../types'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [schedule, setSchedule] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading]);

  const handleAddToSchedule = (item: FoodItem) => {
    if (!schedule.some(i => i.id === item.id)) {
      setSchedule([...schedule, item])
    }
  }

  const handleRemoveFromSchedule = (id: string) => {
    setSchedule(schedule.filter(item => item.id !== id))
  }

  const mockBackendCall = (prompt: string): Promise<Message> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lower = prompt.toLowerCase();
        
        if (lower.includes("gợi ý") || lower.includes("quán") || lower.includes("ăn")) {
          resolve({
            role: 'ai',
            type: 'recommendation',
            content: `Dựa trên yêu cầu "${prompt}", mình tìm thấy vài quán này rất hợp với bạn:`,
            data: [
              {
                id: Math.random().toString(),
                name: 'Phở Thìn Lò Đúc',
                description: 'Nổi tiếng với nước dùng béo ngậy, thịt bò tái lăn và rất nhiều hành lá. Một trải nghiệm Phở Bắc đặc trưng.',
                address: '13 Lò Đúc, Hà Nội',
                rating: 4.8,
                image: 'https://placehold.co/300x200?text=Pho+Thin'
              },
              {
                id: Math.random().toString(),
                name: 'Bún Chả Hương Liên',
                description: 'Quán bún chả huyền thoại nơi Tổng thống Obama từng ghé thăm. Chả nướng than hoa thơm lừng.',
                address: '24 Lê Văn Hưu, Hà Nội',
                rating: 4.7,
                image: 'https://placehold.co/300x200?text=Bun+Cha'
              }
            ]
          })
        } else {
          resolve({
            role: 'ai',
            type: 'chat',
            content: "Chào bạn! Mình là AI Local Food. Bạn muốn tìm quán ăn ở đâu? (Hãy thử: 'Gợi ý quán phở')",
          })
        }
      }, 1500);
    })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { role: 'user', type: 'chat', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await mockBackendCall(userMsg.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SidebarProvider
    style={{ 
      height: 'calc(100vh - 4.5rem)', 
      minHeight: '0'
    }}
    className="w-full overflow-hidden flex bg-white">
      <SidebarLeft />
      <SidebarInset className="h-full flex flex-col flex-1 overflow-hidden">
        <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b px-4 z-10">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <span className="font-semibold text-gray-700">New Itinerary</span>
          </div>
        </header>

        <div className="flex flex-1 flex-col min-h-0 relative bg-white">
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 p-4">
                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8 text-[var(--color-brand)]" />
                 </div>
                 <p className="text-lg">Start chatting to plan your food tour!</p>
              </div>
            ) : (
              <div className="p-4 space-y-6 pb-32">
                {messages.map((msg, index) => (
                  <ChatMessage 
                    key={index} 
                    message={msg} 
                    currentSchedule={schedule} 
                    onAddToSchedule={handleAddToSchedule} 
                  />
                ))}

                {isLoading && (
                  <div className="pl-12 flex items-center gap-2 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                        <Bot size={16}/>
                      </div>
                      <span className="text-sm text-gray-400 italic">AI is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t shrink-0 z-20">
             <div className="mx-auto max-w-3xl relative rounded-2xl border bg-gray-50 focus-within:ring-1 focus-within:ring-[var(--color-brand)] shadow-sm">
              <Textarea
                placeholder="Type your recommendation (Example: Suggest for me a nice restaurant)..."
                className="min-h-[55px] w-full border-0 bg-transparent p-4 pr-14 resize-none focus-visible:ring-0 shadow-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading} 
                size="icon" 
                className="absolute bottom-2 right-2 bg-[var(--color-brand)] text-white h-10 w-10 rounded-xl hover:bg-[var(--color-brand)]/90"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>

      <ScheduleSidebar
        className="hidden lg:flex h-full border-l w-80 bg-white shrink-0"
        scheduleItems={schedule} 
        onRemoveItem={handleRemoveFromSchedule}
      />
    </SidebarProvider>
  )
}
