import { useEffect, useState } from 'react'
import type { FoodItem, Message, Conversation, ScheduleDay, ScheduleItem } from '../types'
import { getLocationsFromDay } from '../utils/map-helpers'

import { historyService } from '@/services/history.service'
import { sendMessageToAI } from '@/services/chat.service'

const NEW_CHAT_ID = 'new';

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
  const [chatStore, setChatStore] = useState<Conversation[]>([]);
  const [currentIdChat, setCurrentIdChat] = useState<string>(NEW_CHAT_ID);

  const [scheduleItemSelected, setScheduleItemSelected] = useState<ScheduleItem|null>(null)
  const [foodCardSelected, setFoodCardSelected] = useState<FoodItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 5;
    
    const fetchSessions = async () => {
      const token = localStorage.getItem('token');

      if(!token) {
        if(retryCount < MAX_RETRIES) {
          console.log(`Token not ready, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          retryCount++;
          setTimeout(fetchSessions, 300);
        }

        return;
      }
      try {
        const sessions = await historyService.getSessions();

        if(isMounted) {
          const mappedSessions: Conversation[] = sessions.map((s: any) => ({
            id: s.id,
            title: s.title || "Conversation",
            messages: []
          }));

          const newChat: Conversation = { id: NEW_CHAT_ID, title: "New Chat", messages: [] };
          setChatStore([newChat, ...mappedSessions]);

          setCurrentIdChat(NEW_CHAT_ID);
        }
      } catch(error) {
        console.error("Failed to load sessions:", error);
      }
      
    };

    fetchSessions();
    return () => { isMounted = false; }
  }, []);

  useEffect(() => {
    if(currentIdChat === NEW_CHAT_ID) return;

    const cachedChat = chatStore.find(c => c.id === currentIdChat);
    if(cachedChat && cachedChat.messages.length > 0) return;

    let isMounted = true;
    setIsLoading(true);

    const fetchHistory = async () => {
      try {
        const rawMessages = await historyService.getSessionMessages(currentIdChat);

        if(isMounted && rawMessages) {
          const mappedMessage: Message[] = rawMessages.map((msg: any) => {
            let dataPayload = msg.widget?.payload;

            return {
              role: msg.message.role === 'assistant' ? 'ai' : 'user',
              content: msg.message.content,
              type: msg.widget?.type || 'chat',
              data: dataPayload
            };
          });

          setChatStore(prev => prev.map(c => 
            c.id === currentIdChat ? {...c, messages: mappedMessage } : c
          ));
        }
      } catch (error) {
        console.error("Load history failed", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistory();
    return () => { isMounted = false; }; 
  }, [currentIdChat]);



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

  const handleSendMessage = async () => {
    if(!inputValue.trim()) return;

    const content = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    const userMsg: Message = { role: 'user', type: 'chat', content };

    const addMsgToStore = (targetId: string, msg: Message) => {
      setChatStore(prev => prev.map(c => c.id === targetId ? { ...c, messages: [...c.messages, msg] } : c))
    };

    addMsgToStore(currentIdChat, userMsg);

    try {
      const sessionIdToSend = currentIdChat === NEW_CHAT_ID ? undefined : currentIdChat;
      const { aiMessage, sessionId } = await sendMessageToAI(content, sessionIdToSend);
      
      if(currentIdChat === NEW_CHAT_ID && sessionId) {
        const newRealId = sessionId;

        setChatStore(prev => {
          const updatedChats = prev.map(c => 
            c.id === NEW_CHAT_ID
              ? {
                ...c,
                id: newRealId,
                title: content.slice(0, 30) + "...",
                messages: [...c.messages, aiMessage]
              }
              : c
          );
          return [{ id: NEW_CHAT_ID, title: "New Chat", messages: [] }, ...updatedChats];
        });

        setCurrentIdChat(newRealId);
      } else {
        addMsgToStore(currentIdChat, aiMessage);
      }
    } catch(error) {
      console.error("Lỗi:", error);
      const errorMsg: Message = { role: 'ai', type: 'chat', content: "Error!" };
      addMsgToStore(currentIdChat, errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const addConversation = () => {
    setCurrentIdChat(NEW_CHAT_ID);
  };

  const currentConversation = chatStore.find(c => c.id === currentIdChat) 
    || { id: NEW_CHAT_ID, title: "New Chat", messages: [] };

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
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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

  const handleRemoveFromSchedule = (idToRemove: string) => {
    if (!idToRemove) return;
    
    setSchedule((prevSchedule) => {
      return prevSchedule.map((day) => ({
        ...day,
        scheduleInDay: day.scheduleInDay.filter((item) => {
          const currentId = item.id || item.food?.id;
          return currentId !== idToRemove;
        }),
      }));
    });
  }

  const handleRemoveDay = (dayToRemove: number) => {
    setSchedule((prev) => {
      const filteredSchedule = prev.filter((d) => d.day !== dayToRemove);

      const reindexedSchedule = filteredSchedule.map((day, index) => ({
        ...day,
        day: index + 1,
        scheduleInDay: day.scheduleInDay.map((item) => ({
          ...item,
          day: index + 1,
        })),
      }));

      return reindexedSchedule;
    });
  };

  const handleOpenDayMap = (daySchedule: ScheduleDay) => {
    const locations = getLocationsFromDay(daySchedule);

    if(locations.length > 0) {
      
    }
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
    currentConversation,
    onAddDay,
    onAddInDay,
    scheduleItemSelected,
    setScheduleItemSelected,
    foodCardSelected,
    setFoodCardSelected,
    handleRemoveDay,
    handleOpenDayMap
  }
}