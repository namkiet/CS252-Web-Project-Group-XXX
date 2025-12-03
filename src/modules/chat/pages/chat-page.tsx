import { SidebarLeft } from '../components/left-sidebar/user-sidebar'
import { ScheduleSidebar } from '../components/right-sidebar/schedule-sidebar'
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"

// Chat and Map
import { ChatHeader } from '../components/chat-area/chat-header'
import { ChatList } from '../components/chat-area/chat-list'
import { ChatInput } from '../components/chat-area/chat-input'
import { GlobalMapModal } from '../components/map-area/global-map-modal'

// Hooks
import { useChat } from '../hooks/use-chat'
import { useMapModal } from '../hooks/use-map-modal'

export default function ChatPage() {
  const {
    inputValue,
    setInputValue,
    schedule,
    isLoading,
    currentIdChat,
    chatStore,
    handleAddToSchedule,
    handleRemoveFromSchedule,
    handleSendMessage,
    addConversation,
    setCurrentIdChat,
    onAddDay,
    onAddInDay,
    scheduleItemSelected,
    setScheduleItemSelected,
    foodCardSelected,
    setFoodCardSelected,
    handleRemoveDay,
  } = useChat();
  
  const mapModal = useMapModal();

  // --- RENDER ---
  return (
    <SidebarProvider
      style={{ height: 'calc(100vh - 4.5rem)', minHeight: '0' }}
      className="w-full overflow-hidden flex bg-white"
    >
      {/* Left Sidebar */}
      <SidebarLeft 
        chatStore={chatStore}
        setCurrentIdChat={setCurrentIdChat}
        addConversation={addConversation}/>
      
      {/* Main Chat Area */}
      <SidebarInset className="h-full flex flex-col flex-1 overflow-hidden">
        <ChatHeader title = {chatStore[currentIdChat].title}/>

        <div className="flex flex-1 flex-col min-h-0 relative bg-white">
          {/* List Message */}
          <ChatList 
            conversation={chatStore[currentIdChat]}
            schedule={schedule}
            isLoading={isLoading}
            onAddToSchedule={handleAddToSchedule}
            foodCardSelected={foodCardSelected}
            setFoodCardSelected={setFoodCardSelected}  
            onShowMap={mapModal.openMap}
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
        schedule={schedule} 
        onRemoveItem={handleRemoveFromSchedule}
        onAddDay={onAddDay}
        onAddInDay={onAddInDay}
        scheduleItemSelected={scheduleItemSelected}
        setScheduleItemSelected={setScheduleItemSelected}
        foodCardSelected={foodCardSelected}
        setFoodCardSelected={setFoodCardSelected}
        onShowMap={mapModal.openMap}
        onRemoveDay={handleRemoveDay}
        onShowDayMap={mapModal.openDayMap}
      />

      <GlobalMapModal 
        isOpen={mapModal.isOpen}
        onClose={mapModal.closeMap}
        locations={mapModal.locations}
        title={mapModal.title}
      />
    </SidebarProvider>
  )
}