import { useState } from 'react'

import { SidebarLeft } from '../components/left-sidebar/user-sidebar'
import { ScheduleSidebar } from '../components/right-sidebar/schedule-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar"

import { ChatHeader } from '../components/chat-area/chat-header'
import { ChatList } from '../components/chat-area/chat-list'
import { ChatInput } from '../components/chat-area/chat-input'

import type { FoodItem, Message } from '../types'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [schedule, setSchedule] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
            content: `Dựa trên yêu cầu "${prompt}", mình tìm thấy vài quán này:`,
            data: [
              {
                id: Math.random().toString(),
                name: 'Phở Thìn Lò Đúc',
                description: 'Nổi tiếng với nước dùng béo ngậy.',
                address: '13 Lò Đúc, Hà Nội',
                rating: 4.8,
                image: 'https://placehold.co/300x200?text=Pho+Thin'
              },
              {
                id: Math.random().toString(),
                name: 'Bún Chả Hương Liên',
                description: 'Quán bún chả huyền thoại.',
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
            content: "Chào bạn! Mình là AI Local Food.",
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

  // --- RENDER ---
  return (
    <SidebarProvider
      style={{ height: 'calc(100vh - 4.5rem)', minHeight: '0' }}
      className="w-full overflow-hidden flex bg-white"
    >
      {/* Left Sidebar */}
      <SidebarLeft />
      
      {/* Main Chat Area */}
      <SidebarInset className="h-full flex flex-col flex-1 overflow-hidden">
        <ChatHeader />

        <div className="flex flex-1 flex-col min-h-0 relative bg-white">
          {/* List Message */}
          <ChatList 
            messages={messages}
            schedule={schedule}
            isLoading={isLoading}
            onAddToSchedule={handleAddToSchedule}
          />

          {/* Input */}
          <ChatInput 
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </SidebarInset>

      {/* Right Sidebar */}
      <ScheduleSidebar
        className="hidden lg:flex h-full border-l w-80 bg-white shrink-0"
        scheduleItems={schedule} 
        onRemoveItem={handleRemoveFromSchedule}
      />
    </SidebarProvider>
  )
}
