import { useState } from 'react'
// import { sendMessageToAI } from '../data/chat-service' // Check lại đường dẫn service của bạn
import { chatService } from "../../../services/chat.service";
import type { FoodItem, Message, Conversation, ScheduleDay, ScheduleItem } from '../types'
import { flushSync } from 'react-dom';

import { hisService } from '@/services/history.service';

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
  const [chatStore, setChatStore] = useState<Conversation[]>([  ]);
  const [currentIdChat, setCurrentIdChat] = useState<number>(0);
  const [scheduleItemSelected, setScheduleItemSelected] = useState<ScheduleItem|null>(null)
  const [foodCardSelected, setFoodCardSelected] = useState<FoodItem | null>(null);
  const [fstLoadInfo, setFstLoadInfo] = useState< Boolean>(false)
  const [isScheduleSidebarOpen, setIsScheduleSidebarOpen] = useState<boolean>(true)

  // --- LOGIC SCHEDULE ---

 const FirstLoadInfo = async () => {
    if (fstLoadInfo) return;
    setFstLoadInfo(true);

    const data = await hisService.sidebarHistory();
    if (!data || data.status !== "success") return;

    const conversations: Conversation[] = data.data.map((item: any) => ({
      id: item.id,
      title: item.title || "New Conversation",
      messages: [],
    }));

    for (const conv of conversations) {
      const sessionId = conv.id;

      const data2 = await hisService.chatHistory(sessionId);
      if (!data2 || data2.status !== "success") continue;

      const msgs = data2.messages || [];

      const parsedMessages: Message[] = msgs.map((m: any) => {
        const baseMessage: Message = {
          role: m.message.role === "assistant" ? "ai" : "user",
          type: "chat",
          content: m.message.content,
        };

        if (m.widget && m.widget.type === "recommendation") {
          return {
            role: "ai",
            type: "recommendation",
            content: m.message.content,
            data: m.widget.payload.map((item: any) => ({
              id: crypto.randomUUID(),
              name: item.restaurant_name,
              image: "", 
              description: item.desc,
              address: "",
              rating: Number(item.star),
              cuisine: item.dish_name,
              priceRange: "",
              openTime: "",
            })),
          };
        }

        return baseMessage;
      });

      conv.messages = parsedMessages;
    }

    setChatStore(conversations);
  };


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

  const toggleScheduleSidebar = () => {
    setIsScheduleSidebarOpen(prev => !prev);
  };

  const handleRemoveFromSchedule = (id: string) => {
    // setSchedule(schedule.filter(item => item.id !== id))
  }

  // --- LOGIC SEND MESSAGE ---
  const addMessageToCurrentChat = (msg: Message) => {
    console.log("before send message id",chatStore[currentIdChat].id)
    console.log("Messages before update:", chatStore[currentIdChat].messages);
    setChatStore(prev => {
      const newState = prev.map((chat, index) =>
        index === currentIdChat
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      );
      console.log("after send message newState id",newState[currentIdChat].id)
      console.log("Messages after newState update:", newState[currentIdChat].messages);
      return newState;
    });
    console.log("after send message id",chatStore[currentIdChat].id)
    console.log("Messages after update:", chatStore[currentIdChat].messages);
  };


  const addConversation = () => {
    setChatStore(prev => {
      const newState = [
        ...prev,
        {
          id: "",
          title: `Conversation ${prev.length}`,
          messages: []
        }
      ];

      // console.log("All messages after adding:");
      newState.forEach((conv, i) => {
        console.log(`Conversation ${i} messages:`, conv.messages);
      });

      return newState;
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessageContent = inputValue.trim();

    // 1. Show user message instantly
    const userMsg: Message = {
      role: 'user',
      type: 'chat',
      content: userMessageContent,
      data: undefined,
    };
    addMessageToCurrentChat(userMsg);

    setInputValue('');
    setIsLoading(true);
    try {
      // console.log("Before setter the new id" , chatStore[currentIdChat].id)
      // 2. Determine if we are inside an existing valid chat session
      let sessionIdToSend: string | undefined = undefined;

      sessionIdToSend = chatStore[currentIdChat].id;

      // 3. Send message to backend
      const aiResponse = await chatService.sendText(
        userMessageContent,
        sessionIdToSend               // undefined if new chat, string if continuing
        // location not available yet → omitted
      );

      // 4. Build AI message according to your exact Message type
      const aiMsg: Message = {
        role: 'ai',
        type: aiResponse.widget.type,           // "chat" or "recommendation"
        content: aiResponse.message.content,
        data: aiResponse.widget.payload,        // null or FoodItem[] (already enriched)
      };

      // 5. Add AI response to UI
      addMessageToCurrentChat(aiMsg);
      // 6. If this was a brand-new conversation → save the session_id returned by backend
      if (!sessionIdToSend && aiResponse.session_id) {
        flushSync(() => {
          setChatStore(prevChatStore =>
            prevChatStore.map((item, index) =>
              index === currentIdChat
                ? { ...item, id: aiResponse.session_id }  
                : item
            )
          );
        });
      }

    } catch (error: any) {
      console.error('Failed to send message:', error);

      const errorMsg: Message = {
        role: 'ai',
        type: 'chat',
        content: 'Xin lỗi, mình đang gặp lỗi. Vui lòng thử lại sau ít phút nhé',
        data: undefined,
      };
      addMessageToCurrentChat(errorMsg);
    } finally {
      setIsLoading(false);
    }
    // console.log("After setter the new id" , chatStore[currentIdChat].id)
  };

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
    setFoodCardSelected,
    FirstLoadInfo,
    isScheduleSidebarOpen,
    toggleScheduleSidebar

  }
}