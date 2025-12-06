import { SidebarLeft } from '../components/left-sidebar/user-sidebar'
import { ScheduleSidebar } from '../components/right-sidebar/schedule-sidebar'
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"

import { ChatHeader } from '../components/chat-area/chat-header'
import { ChatList } from '../components/chat-area/chat-list'
import { ChatInput } from '../components/chat-area/chat-input'
import { GlobalMapModal } from '../components/map-area/global-map-modal'

import { useChat } from '../hooks/use-chat' // hooks
import { useMapModal } from '../hooks/use-map-modal'
import { type Conversation } from '../types';

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
    isScheduleSidebarOpen,
    toggleScheduleSidebar,
    handleRemoveDay,
    handleDeleteSession
  } = useChat();

  const mapModal = useMapModal();

  const activeConversation: Conversation = chatStore && chatStore[currentIdChat] 
    ? chatStore[currentIdChat] 
    : { id: "", title: "New Conversation...", messages: [] };

  return (
    <SidebarProvider
      style={{ height: 'calc(100vh - 4.5rem)', minHeight: '0' }}
      className="w-full overflow-hidden flex bg-white"
    >
      {/* Left Sidebar */}
      <SidebarLeft 
        chatStore={chatStore}
        setCurrentIdChat={setCurrentIdChat}
        addConversation={addConversation}
        onDeleteSession={handleDeleteSession}
      />
      
      {/* Main Chat Area */}
      <SidebarInset className="h-full flex flex-col flex-1 overflow-hidden">
        <ChatHeader 
          title={activeConversation.title}
          isScheduleSidebarOpen={isScheduleSidebarOpen}
          onToggleScheduleSidebar={toggleScheduleSidebar}
        />

        <div className="flex flex-1 flex-col min-h-0 relative bg-white">
          {/* List Message */}
          <ChatList 
            conversation={activeConversation}
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
      <div className={`hidden lg:block transition-all duration-300 ease-in-out transform ${
        isScheduleSidebarOpen 
          ? 'translate-x-0 w-80' 
          : 'translate-x-full w-0'
      }`}>
        <ScheduleSidebar
          className="h-full border-l w-80 bg-white shrink-0"
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
      </div>

      <GlobalMapModal 
        isOpen={mapModal.isOpen}
        onClose={mapModal.closeMap}
        locations={mapModal.locations}
        title={mapModal.title}
      />
    </SidebarProvider>
  )
}