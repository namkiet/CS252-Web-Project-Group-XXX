import { SidebarLeft } from '../components/left-sidebar/user-sidebar'
import { ScheduleSidebar } from '../components/right-sidebar/schedule-sidebar'
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"

import { ChatHeader } from '../components/chat-area/chat-header'
import { ChatList } from '../components/chat-area/chat-list'
import { ChatInput } from '../components/chat-area/chat-input'

import { useChat } from '../hooks/use-chat' // hooks

export default function ChatPage() {
  const {
    messages,
    inputValue,
    setInputValue,
    schedule,
    isLoading,
    handleAddToSchedule,
    handleRemoveFromSchedule,
    handleSendMessage
  } = useChat();

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