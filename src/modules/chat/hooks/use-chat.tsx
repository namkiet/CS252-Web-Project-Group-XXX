import { useState } from 'react'
import { sendMessageToAI } from '../data/chat-service' // Check lại đường dẫn service của bạn
import type { FoodItem, Message } from '../types'

export function useChat() {
  // --- STATE ---
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [schedule, setSchedule] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { role: 'user', type: 'chat', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Service
      const aiResponse = await sendMessageToAI(userMsg.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Return all for UI in chat-page
  return {
    messages,
    inputValue,
    setInputValue,
    schedule,
    isLoading,
    handleAddToSchedule,
    handleRemoveFromSchedule,
    handleSendMessage
  }
}