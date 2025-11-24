import { useState } from 'react'
import { sendMessageToAI } from '../data/chat-service' // Check lại đường dẫn service của bạn
import type { FoodItem, Message, Conversation } from '../types'

export function useChat() {
  // --- STATE ---
  const [inputValue, setInputValue] = useState('')
  const [schedule, setSchedule] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatStore, setChatStore] = useState<Conversation[]>([
    { messages: [] , title: "start" }
  ]);
  const [currentIdChat, setCurrentIdChat] = useState<number>(0);

  // --- LOGIC SCHEDULE ---
  const handleAddToSchedule = (item: FoodItem) => {
    if (!schedule.some(i => i.id === item.id)) {
      setSchedule([...schedule, item])
    }
  }

  const handleRemoveFromSchedule = (id: string) => {
    setSchedule(schedule.filter(item => item.id !== id))
  }

  // --- LOGIC SEND MESSAGE ---
  const addMessageToCurrentChat = (msg: Message) => {
    setChatStore(prev => 
      prev.map((chat, index) =>
        index === currentIdChat
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );
  };

  const addConversation = () => {
    setChatStore(prev => [
      ...prev,
      {
        id: prev.length-1,       
        title: `Conversation ${prev.length}`, 
        messages: []           
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { role: 'user', type: 'chat', content: inputValue };
    addMessageToCurrentChat(userMsg);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Service
      const aiResponse = await sendMessageToAI(userMsg.content);
      addMessageToCurrentChat(aiResponse);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Return all for UI in chat-page
  return {
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
    setCurrentIdChat
  }
}