import { useState } from 'react'
import { sendMessageToAI } from '../data/chat-service' // Check lại đường dẫn service của bạn
import type { FoodItem, Message, Conversation, ScheduleDay, ScheduleItem } from '../types'

export function useChat() {
  // --- STATE ---
  const [inputValue, setInputValue] = useState('')
  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    {
      day: 1,
      scheduleInDay: []
    }
  ]);
  const [isLoading, setIsLoading] = useState(false)
  const [chatStore, setChatStore] = useState<Conversation[]>([
    { messages: [] , title: "start" }
  ]);
  const [currentIdChat, setCurrentIdChat] = useState<number>(0);
  const [scheduleItemSelected, setScheduleItemSelected] = useState<ScheduleItem|null>(null)
  const [foodCardSelected, setFoodCardSelected] = useState<FoodItem | null>(null);

  // --- LOGIC SCHEDULE ---

 const onAddDay = (insertAtIndex: number = -1) => {
  setSchedule(prev => {
    const insertPos =
      insertAtIndex === -1 || insertAtIndex >= prev.length
        ? prev.length
        : insertAtIndex < 0
        ? 0
        : insertAtIndex;

    const newDayNumber =
      insertPos === 0
        ? 1
        : prev[insertPos - 1].day + 1;

    const result: ScheduleDay[] = [];

    prev.forEach((dayObj, idx) => {
      if (idx < insertPos) {
        result.push(dayObj);
      } else {
        const shiftedDay = dayObj.day + 1;
        const updatedItems = dayObj.scheduleInDay.map(item => ({
          ...item,
          day: shiftedDay
        }));

        result.push({
          ...dayObj,
          day: shiftedDay,
          scheduleInDay: updatedItems
        });
      }
    });

    result.splice(insertPos, 0, {
      day: newDayNumber,
      scheduleInDay: []
    });


    return result;
  });
};

  const onAddInDay = (
    dayNumber: number = -1,
    position: number | ScheduleItem = -1,
    activity: string = "",
    food: FoodItem | null = null
  ) => {
    setSchedule(prev => {
      if (prev.length === 0) return prev;

      let targetDay: number;
      let insertPos: number = -1;

      if (typeof position === "object" && position !== null) {
        targetDay = position.day;
        const dayData = prev.find(d => d.day === targetDay);
        if (dayData) {
          const idx = dayData.scheduleInDay.indexOf(position);
          insertPos = idx === -1 ? -1 : idx + 1;
        }
      } else {
        targetDay = dayNumber === -1 
          ? prev[prev.length - 1].day 
          : dayNumber;

        insertPos = position as number;
      }

      if (!prev.some(d => d.day === targetDay)) return prev;

      const newItem: ScheduleItem = {
        activity,
        day: targetDay,
        food: food ?? undefined
      };

      return prev.map(dayObj => {
        if (dayObj.day !== targetDay) return dayObj;

        const items = dayObj.scheduleInDay;

        if (insertPos === -1 || insertPos >= items.length) {
          return { ...dayObj, scheduleInDay: [...items, newItem] };
        }
        if (insertPos <= 0) {
          return { ...dayObj, scheduleInDay: [newItem, ...items] };
        }

        const list = [...items];
        list.splice(insertPos, 0, newItem);
        return { ...dayObj, scheduleInDay: list };
      });
    });
  };

  const handleAddToSchedule = (
    foodItem: FoodItem,
    targetDay?: number
  ) => {
    setSchedule(prev => {
      if (scheduleItemSelected) {
        return prev.map(dayObj => ({
          ...dayObj,
          scheduleInDay: dayObj.scheduleInDay.map(item =>
            item === scheduleItemSelected
              ? { ...item, food: foodItem }
              : item
          )
        }));
      }

      let dayToAdd: number;

      if (targetDay !== undefined && targetDay !== -1) {
        dayToAdd = targetDay;
      } else {
        dayToAdd = prev.length > 0 ? prev[prev.length - 1].day : 1;
      }

      const newItem: ScheduleItem = {
        activity: "",
        day: dayToAdd,
        food: foodItem
      };

      return prev.map(dayObj => {
        if (dayObj.day === dayToAdd) {
          return {
            ...dayObj,
            scheduleInDay: [...dayObj.scheduleInDay, newItem]
          };
        }
        return dayObj;
      });
    });

    setScheduleItemSelected(null);
  };

  const handleRemoveFromSchedule = (id: string) => {
    // setSchedule(schedule.filter(item => item.id !== id))
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
    setCurrentIdChat,
    onAddDay,
    onAddInDay,
    scheduleItemSelected,
    setScheduleItemSelected,
    foodCardSelected,
    setFoodCardSelected

  }
}