import { useState, useEffect, useMemo } from 'react'
import { chatService } from "../../../services/chat.service";
import { hisService } from '@/services/history.service';
import type { FoodItem, Message, ScheduleDay, ScheduleItem } from '../types'
import { flushSync } from 'react-dom';

import { getLocationsFromDay } from '../utils/map-helpers'
import { useChatContext } from '@/context/chat-context';

export function useChat() {
  const { 
    chatStore, 
    setChatStore, 
    currentIdChat, 
    setCurrentIdChat, 
    isLoadingHistory,
    fetchInitialMessages
  } = useChatContext();

  const [inputValue, setInputValue] = useState('');
  const defaultSchedule = useMemo<ScheduleDay[]>(() => ([{ day: 1, scheduleInDay: [] }]), []);
  const [schedule, setSchedule] = useState<ScheduleDay[]>(defaultSchedule);
  const [isLoading, setIsLoading] = useState(false);

  // Allow selecting either a specific schedule item or a whole day (by day number)
  const [scheduleItemSelected, setScheduleItemSelected] = useState<ScheduleItem | number | null>(null)
  const [foodCardSelected, setFoodCardSelected] = useState<FoodItem | null>(null);
  const [isScheduleSidebarOpen, setIsScheduleSidebarOpen] = useState<boolean>(true)
  const [swappedItemIds, setSwappedItemIds] = useState<string[]>([])

  useEffect(() => {
    const activeSession = chatStore[currentIdChat];
    if (chatStore.length > 0 && activeSession && activeSession.id) {
      fetchInitialMessages(currentIdChat);
    }
  }, [currentIdChat, chatStore.length, fetchInitialMessages]);

  // Sync schedule when switching conversations
  useEffect(() => {
    const activeSession = chatStore[currentIdChat];
    if (activeSession && activeSession.schedule && activeSession.schedule.length > 0) {
      setSchedule(activeSession.schedule);
    } else {
      setSchedule(defaultSchedule);
    }
  }, [chatStore, currentIdChat, defaultSchedule]);

  // Prefill input from sessionStorage draft when switching conversations
  useEffect(() => {
    const activeSession = chatStore[currentIdChat];
    if (activeSession && activeSession.id) {
      const key = `chat_draft_${activeSession.id}`;
      const draft = sessionStorage.getItem(key);
      if (draft !== null) {
        setInputValue(draft);
        // Don't remove the draft here - keep it persisted until message is sent
      }
    }
  }, [chatStore, currentIdChat]);

  // helper to update schedule and persist into chatStore for the current conversation
  const updateSchedule = (updater: (prev: ScheduleDay[]) => ScheduleDay[]) => {
    setSchedule(prev => {
      const next = updater(prev);
      setChatStore(prevStore => {
        const newStore = [...prevStore];
        if (newStore[currentIdChat]) {
          newStore[currentIdChat] = {
            ...newStore[currentIdChat],
            schedule: next,
          } as any;
        }
        return newStore;
      });
      return next;
    });
  };

  const onAddDay = (insertAtIndex: number = -1) => {
    updateSchedule(prev => {
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
    updateSchedule(prev => {
      if (prev.length === 0) return prev;

      // Check if food already exists in schedule
      if (food) {
        const foodExists = prev.some(dayObj =>
          dayObj.scheduleInDay.some(item => item.food?.id === food.id)
        );
        if (foodExists) {
          console.warn(`Food "${food.restaurant_name}" already exists in schedule`);
          return prev;
        }
      }

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
    updateSchedule(prev => {
      if (scheduleItemSelected && typeof scheduleItemSelected !== "number") {
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
      } else if (typeof scheduleItemSelected === "number") {
        dayToAdd = scheduleItemSelected;
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

  const handleRemoveFromSchedule = (idToRemove: string) => {
    if (!idToRemove) return;
    
    updateSchedule((prevSchedule) => {
      return prevSchedule.map((day) => ({
        ...day,
        scheduleInDay: day.scheduleInDay.filter((item) => {
          const currentId = item.id || item.food?.id;
          return currentId !== idToRemove;
        }),
      }));
    });
  }

  // --- LOGIC SEND MESSAGE ---
  const addMessageToCurrentChat = (msg: Message) => {
    setChatStore(prev => {
      if (prev.length === 0) return prev;
      
      const newState = prev.map((chat, index) =>
        index === currentIdChat
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      );
      return newState;
    });
  };


  const addConversation = async () => {
    const created = await hisService.addSession('New Conversation');
    const newSession = created?.data;

    setChatStore(prev => {
      const next = [...prev];
      const newConv = {
        id: newSession?.id || "",
        title: newSession?.title || `Conversation ${prev.length + 1}`,
        messages: [],
        schedule: defaultSchedule,
        savedSchedule: [...defaultSchedule],
        suggestedDish: []
      } as any;
      next.push(newConv);
      return next;
    });
    setCurrentIdChat(chatStore.length);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Build message with suggested dishes at the top
    const activeSession = chatStore[currentIdChat];
    const suggested = activeSession?.suggestedDish || [];
    let userMessageContent = inputValue.trim();
    
    if (suggested.length > 0) {
      userMessageContent = `i want to eat and experience the taste of ${suggested.join(', ')} . ${inputValue.trim()}`;
    }

    const userMsg: Message = {
      role: 'user',
      type: 'chat',
      content: userMessageContent,
      data: undefined,
    };
    addMessageToCurrentChat(userMsg);

    // Clear the draft from sessionStorage and suggestedDish when sending
    if (activeSession && activeSession.id) {
      sessionStorage.removeItem(`chat_draft_${activeSession.id}`);
    }

    // Clear suggestedDish after sending
    if (suggested.length > 0) {
      setChatStore(prev => {
        const newStore = [...prev];
        if (newStore[currentIdChat]) {
          newStore[currentIdChat] = {
            ...newStore[currentIdChat],
            suggestedDish: []
          } as any;
        }
        return newStore;
      });
    }

    setInputValue('');
    setIsLoading(true);
    try {
      let sessionIdToSend: string | undefined = undefined;

      sessionIdToSend = chatStore[currentIdChat].id;

      const aiResponse = await chatService.sendText(
        userMessageContent,
        sessionIdToSend
      );

      const aiMsg: Message = {
        role: 'ai',
        type: aiResponse.widget.type,
        content: aiResponse.message.content,
        data: aiResponse.widget.payload,
      };

      addMessageToCurrentChat(aiMsg);
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
        content: 'Sorry, I\'m having trouble. Please try again in a few minutes.',
        data: undefined,
      };
      addMessageToCurrentChat(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDay = (dayToRemove: number) => {
    updateSchedule((prev) => {
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

  const handleSwapScheduleItems = (item1: ScheduleItem, item2: ScheduleItem) => {
    updateSchedule((prev) => {
      let item1Day = -1, item1Idx = -1;
      let item2Day = -1, item2Idx = -1;

      prev.forEach((dayObj) => {
        const idx1 = dayObj.scheduleInDay.findIndex(
          (item) => item === item1 || (item.id === item1.id && item.id)
        );
        if (idx1 !== -1) {
          item1Day = dayObj.day;
          item1Idx = idx1;
        }

        const idx2 = dayObj.scheduleInDay.findIndex(
          (item) => item === item2 || (item.id === item2.id && item.id)
        );
        if (idx2 !== -1) {
          item2Day = dayObj.day;
          item2Idx = idx2;
        }
      });

      if (item1Day === -1 || item2Day === -1) return prev;

      if (item1Day === item2Day) {
        return prev.map((dayObj) => {
          if (dayObj.day === item1Day) {
            const items = [...dayObj.scheduleInDay];
            [items[item1Idx], items[item2Idx]] = [items[item2Idx], items[item1Idx]];
            return { ...dayObj, scheduleInDay: items };
          }
          return dayObj;
        });
      }

      return prev.map((dayObj) => {
        if (dayObj.day === item1Day) {
          const items = [...dayObj.scheduleInDay];
          items[item1Idx] = { ...item2, day: item1Day };
          return { ...dayObj, scheduleInDay: items };
        } else if (dayObj.day === item2Day) {
          const items = [...dayObj.scheduleInDay];
          items[item2Idx] = { ...item1, day: item2Day };
          return { ...dayObj, scheduleInDay: items };
        }
        return dayObj;
      });
    });

    const id1 = item1.id || item1.food?.id;
    const id2 = item2.id || item2.food?.id;
    if (id1 && id2) {
      setSwappedItemIds([id1, id2]);
      setTimeout(() => setSwappedItemIds([]), 900);
    }

    setScheduleItemSelected(null);
  };

  const handleOpenDayMap = (daySchedule: ScheduleDay) => {
    const locations = getLocationsFromDay(daySchedule);

    if(locations.length > 0) {
      
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const isDelete = await hisService.deleteSession(sessionId);

      if (isDelete) {
        const newChatStore = chatStore.filter((chat) => chat.id !== sessionId);
        setChatStore(newChatStore);

        if (newChatStore.length === 0) {
          setChatStore([{
              id: "",
              title: "New Conversation",
              messages: [],
              schedule: defaultSchedule
            }]);
            setCurrentIdChat(0);
        } else {
          setChatStore(newChatStore);
          setCurrentIdChat(0);
        }
        
      } else {
        console.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    setChatStore(prev => prev.map(chat => 
      chat.id === sessionId 
        ? { ...chat, title: newTitle } 
        : chat
    ));

    try {
      const isSuccess = await hisService.renameSession(sessionId, newTitle);
      
      if (!isSuccess) {
        console.error("Failed to rename on server");
      }
    } catch (error) {
      console.error("Error renaming:", error);
    }
  }

  const handleSaveSchedule = async () => {
    const activeSession = chatStore[currentIdChat];
    if (!activeSession || !activeSession.id) {
      console.warn('No active session');
      return;
    }

    // Format schedule as JSON
    const scheduleJSON = saveScheduleAsJSON();
    if (!scheduleJSON) {
      console.warn('Failed to format schedule');
      return;
    }

    // Save to backend
    try {
      const isSuccess = await hisService.updateSchedule(activeSession.id, scheduleJSON);
      
      if (isSuccess) {
        // Update savedSchedule in state
        setChatStore(prev => {
          const newStore = [...prev];
          const conv = newStore[currentIdChat];
          if (conv && conv.schedule) {
            newStore[currentIdChat] = {
              ...conv,
              savedSchedule: JSON.parse(JSON.stringify(conv.schedule))
            } as any;
          }
          return newStore;
        });
      } else {
        console.error("Failed to save schedule on server");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleUndoSchedule = () => {
    setChatStore(prev => {
      const newStore = [...prev];
      const conv = newStore[currentIdChat];
      if (conv && conv.savedSchedule) {
        newStore[currentIdChat] = {
          ...conv,
          schedule: JSON.parse(JSON.stringify(conv.savedSchedule))
        } as any;
      }
      return newStore;
    });
  };

  const saveScheduleAsJSON = () => {
    const activeSession = chatStore[currentIdChat];
    if (!activeSession || !activeSession.schedule) {
      console.warn('No schedule to save');
      return null;
    }

    const scheduleData = activeSession.schedule;
    
    const formattedSchedule = {
      cntDay: scheduleData.length.toString(),
      dayList: scheduleData.map((day) => ({
        day: day.day.toString(),
        'dish-list': day.scheduleInDay.map((item) => ({
          activity: item.activity || '',
          restaurant_name: item.food?.restaurant_name || '',
          dish_name: item.food?.dish_name || '',
          address: item.food?.address || '',
          lat: item.food?.coordinates?.lat?.toString() || '',
          lon: item.food?.coordinates?.lng?.toString() || '',
          desc: item.food?.desc || '',
          star: item.food?.star?.toString() || '',
          price: item.food?.priceRange || '',
          img: item.food?.image || '',
          openTime: item.food?.openTime || ''
        }))
      }))
    };

    return formattedSchedule;
  };

  return {
    inputValue,
    setInputValue,
    schedule,
    isLoading: isLoading || isLoadingHistory,
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
    handleOpenDayMap,
    handleDeleteSession,
    handleRenameSession,
    handleSwapScheduleItems,
    swappedItemIds,
    handleSaveSchedule,
    handleUndoSchedule,
    saveScheduleAsJSON
  }
}