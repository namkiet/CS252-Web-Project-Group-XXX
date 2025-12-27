import { useState } from 'react';
import { 
  Calendar, 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SidebarLeft } from '../components/left-sidebar/user-sidebar'
import { ScheduleSidebar } from '../components/right-sidebar/schedule-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/shared/components/ui/sheet"

import { Button } from "@/shared/components/ui/button"

import { ChatHeader } from '../components/chat-area/chat-header'
import { ChatList } from '../components/chat-area/chat-list'
import { ChatInput } from '../components/chat-area/chat-input'
import { GlobalMapModal } from '../components/map-area/global-map-modal'

import { useChat } from '../hooks/use-chat' // hooks
import { useMapModal } from '../hooks/use-map-modal'
import { type Conversation } from '../types';

export default function ChatPage() {
  const { t } = useTranslation();

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
    handleRemoveSuggestedDish,
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
    handleDeleteSession,
    handleRenameSession,
    handleTogglePin,
    handleSwapScheduleItems,
    swappedItemIds,
    handleUndoSchedule
  } = useChat();

  const mapModal = useMapModal();
  const [isMobileScheduleOpen, setIsMobileScheduleOpen] = useState(false);

  const activeConversation: Conversation = chatStore && chatStore[currentIdChat] 
    ? chatStore[currentIdChat] 
    : { 
        id: "", 
        title: t('chat.area.new_conversation'), 
        messages: [], 
        suggestedDish: [] 
      } as any;

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
        onRenameSession={handleRenameSession}
        onTogglePin={handleTogglePin}
      />
      
      {/* Main Chat Area */}
      <SidebarInset className="h-full flex flex-col flex-1 overflow-hidden">
        <header className="flex h-12 sm:h-16 items-center gap-2 border-b px-4 shrink-0 bg-white justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SidebarTrigger className="-ml-2 md:hidden text-gray-500" />
            
            <div className="flex-1 min-w-0">
              <ChatHeader 
                title={activeConversation.title}
                isScheduleSidebarOpen={isScheduleSidebarOpen}
                onToggleScheduleSidebar={toggleScheduleSidebar}
              />
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-orange-600 hover:bg-orange-50 shrink-0"
            onClick={() => setIsMobileScheduleOpen(true)}
          >
            <Calendar className="h-6 w-6" />
          </Button>
        </header>

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
            onRemoveDish={handleRemoveSuggestedDish}
            isLoading={isLoading}
            suggestedDish={activeConversation.suggestedDish || []}
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
          scheduleList={activeConversation.scheduleList || []}
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
          onSwapItems={handleSwapScheduleItems}
          swappedItemIds={swappedItemIds}
          onUndoSchedule={handleUndoSchedule}
        />
      </div>

      <Sheet open={isMobileScheduleOpen} onOpenChange={setIsMobileScheduleOpen}>
        <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 bg-white">
          {/* Header ẩn để fix lỗi accessibility */}
          <SheetHeader className="hidden">
            <SheetTitle>{t('chat.area.mobile_schedule_title')}</SheetTitle>
            <SheetDescription>{t('chat.area.mobile_schedule_desc')}</SheetDescription>
          </SheetHeader>

          <div className="h-full flex flex-col">
            <ScheduleSidebar
              className="flex-1 w-full border-none"
              schedule={schedule} 
              scheduleList={activeConversation.scheduleList || []}
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
              onSwapItems={handleSwapScheduleItems}
              swappedItemIds={swappedItemIds}
              onUndoSchedule={handleUndoSchedule}
            />
          </div>
        </SheetContent>
      </Sheet>

      <GlobalMapModal 
        isOpen={mapModal.isOpen}
        onClose={mapModal.closeMap}
        locations={mapModal.locations}
        title={mapModal.title}
      />
    </SidebarProvider>
  )
}