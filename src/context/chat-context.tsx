import React, { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from 'react'
import { hisService } from '@/services/history.service'
import type { Conversation, Message } from '@/modules/chat/types'

interface ChatContextType {
  chatStore: Conversation[];
  setChatStore: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentIdChat: number;
  setCurrentIdChat: React.Dispatch<React.SetStateAction<number>>;

  isLoadingHistory: boolean;
  isLoadingMessages: boolean;

  refreshHistory: () => Promise<void>;
  fetchInitialMessages: (index: number) => Promise<void>; // Load 10 message
  loadMoreMessages: (index: number) => Promise<boolean>; // Load more message if user scrolls back
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const parseBackendSchedule = (raw: any): any[] => {
  if (!raw) return [];

  if (Array.isArray(raw)) return raw;

  const dayList = Array.isArray(raw.dayList) ? raw.dayList : [];

  return dayList.map((dayItem: any, dayIdx: number) => {
    const dayNumber = Number(dayItem?.day) || dayIdx + 1;
    const dishList = Array.isArray(dayItem?.['dish-list']) ? dayItem['dish-list'] : [];

    const scheduleInDay = dishList.map((dish: any, itemIdx: number) => {
      const lat = dish?.lat !== undefined ? Number(dish.lat) : undefined;
      const lon = dish?.lon !== undefined ? Number(dish.lon) : undefined;
      const safeId = typeof crypto !== 'undefined' && (crypto as any).randomUUID
        ? (crypto as any).randomUUID()
        : `sched_${dayNumber}_${itemIdx}_${Date.now()}`;

      return {
        id: safeId,
        activity: dish?.activity || '',
        day: dayNumber,
        food: {
          id: safeId,
          restaurant_name: dish?.restaurant_name || '',
          image: dish?.img || '',
          desc: dish?.desc || '',
          address: dish?.address || '',
          star: dish?.star ? Number(dish.star) : 0,
          dish_name: dish?.dish_name || '',
          priceRange: dish?.price ? String(dish.price) : '',
          openTime: dish?.openTime || '',
          coordinates: lat !== undefined && lon !== undefined ? { lat, lng: lon } : undefined,
        }
      } as any;
    });

    return {
      day: dayNumber,
      scheduleInDay,
    } as any;
  });
};

export const ChatProvider = ( { children }: { children: ReactNode} ) => {
  const [chatStore, setChatStore] = useState<Conversation[]>([]);
  const [currentIdChat, setCurrentIdChat] = useState<number>(0);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadedSessions, setIsLoadedSessions] = useState(false);

  const chatStoreRef = useRef(chatStore);
  
  useEffect(() => {
    chatStoreRef.current = chatStore;
  }, [chatStore]);

  const mapMessages = useCallback((msgs: any[]): Message[] => {
    return msgs.map((m: any, idx: number) => {
      const baseMessage: Message = {
          role: m.message?.role === "assistant" || m.role === "assistant" ? "ai" : "user",
          type: "chat",
          content: m.message?.content || m.content || "",
      };

      const widgetData = m.widget || m.metadata;
      const rawPayload = widgetData?.payload || widgetData?.data;
      
      if (widgetData?.type === "recommendation" && Array.isArray(rawPayload) && rawPayload.length > 0) {
          return {
              ...baseMessage,
              type: "recommendation",
              data: rawPayload.map((item: any) => {
                const lat = item.coordinates?.lat ?? item.lat;
                const lng = item.coordinates?.lng ?? item.lon;

                return {
                  ...item,
                  id: item.id || crypto.randomUUID(),
                  restaurant_name: item.restaurant_name || "Restaurant",
                  image: item.image || item.img || "", 
                  desc: item.desc || item.description || "",
                  address: item.address || "",
                  star: Number(item.star || 0),
                  dish_name: item.dish_name || "",
                  priceRange: item.priceRange || "",
                  openTime: item.openTime || "",
                  coordinates: lat !== undefined && lng !== undefined 
                    ? { lat: Number(lat), lng: Number(lng) } 
                    : undefined,
                };
              })
          };
      }
      return baseMessage;
    });
  }, []);

  const loadHistory = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    setIsLoadingHistory(true);
    try{
      const sessionData = await hisService.sidebarHistory();
      if (!sessionData || sessionData.status !== "success") return;

      const conversations: Conversation[] = sessionData.data.map((item: any) => ({
        id: item.id,
        title: item.title || "New Conversation",
        is_pinned: item.is_pinned || false,
        messages: [],
        hasMore: true,
        offset: 0,
        isLoaded: false,
        schedule: [{ day: 1, scheduleInDay: [] }],
        savedSchedule: [{ day: 1, scheduleInDay: [] }],
        suggestedDish: []
      } as any));

      setChatStore(conversations);
      setIsLoadedSessions(true);
      
    } catch (error) {
      console.error("Error load session:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const fetchInitialMessages = useCallback(async (index: number) => {
    const currentStore = chatStoreRef.current;
    if (!currentStore[index]) return;

    if (!currentStore[index].id) {
        setChatStore(prev => {
            const newStore = [...prev];
            newStore[index] = {
                ...newStore[index],
                messages: [],
                isLoaded: true,
                hasMore: false
            } as any;
            return newStore;
        });
        return; 
    }

    if ((currentStore[index] as any).isLoaded && currentStore[index].messages.length > 0) return;

    setIsLoadingMessages(true);
    try {
        const sessionId = currentStore[index].id;
        
        // Load messages and schedule in parallel
        const [data, schedule] = await Promise.all([
          hisService.chatHistory(sessionId, 10, 0),
          hisService.getSessionSchedule(sessionId)
        ]);
        
        if (data.status === "success") {
          const rawMsgs = data.messages || [];
            
          const parsed = mapMessages(rawMsgs).reverse();

          setChatStore(prev => {
            const newStore = [...prev];
            const convertedSchedule = parseBackendSchedule(schedule);
            const scheduleToSet = convertedSchedule.length > 0 
              ? convertedSchedule 
              : currentStore[index].schedule;

            newStore[index] = {
              ...newStore[index],
              messages: parsed,
              offset: rawMsgs.length,
              hasMore: rawMsgs.length >= 10,
              isLoaded: true,
              schedule: scheduleToSet,
              savedSchedule: scheduleToSet
            } as any;
            return newStore;
          });
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoadingMessages(false);
    }
  }, [mapMessages]);

  const loadMoreMessages = useCallback(async (index: number): Promise<boolean> => {
    const conv = chatStore[index];
    if (!conv || !conv.id || !(conv as any).hasMore) return false;

    const currentOffset = (conv as any).offset || 0;
    const sessionId = conv.id;
    
    try {
      const data = await hisService.chatHistory(sessionId, 20, currentOffset);
      
      if (data.status === "success") {
        const rawMsgs = data.messages || [];
        
        if (rawMsgs.length === 0) {
            setChatStore(prev => {
                const newStore = [...prev];
                newStore[index] = { ...newStore[index], hasMore: false } as any;
                return newStore;
            });
            return false;
        }

        const parsed = mapMessages(rawMsgs).reverse();
        
        setChatStore(prev => {
            const newStore = [...prev];
            const updatedMessages = [...parsed, ...newStore[index].messages];
            
            newStore[index] = {
                ...newStore[index],
                messages: updatedMessages,
                offset: currentOffset + rawMsgs.length,
                hasMore: rawMsgs.length >= 20
            } as any;
            return newStore;
        });
        return true;
      }
    } catch(e) {
        console.error(e);
    }
    return false;
  }, [mapMessages]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token && !isLoadedSessions) {
        loadHistory();
    }
  }, []);

   useEffect(() => {
    if (isLoadedSessions && chatStoreRef.current.length > 0) {
        const firstItem = chatStoreRef.current[0];
        if (!(firstItem as any).isLoaded) {
            fetchInitialMessages(0);
        }
    }
  }, [isLoadedSessions, fetchInitialMessages]);

  return (
    <ChatContext.Provider 
      value={{ 
        chatStore, 
        setChatStore, 
        currentIdChat,
        setCurrentIdChat,
        isLoadingHistory, 
        isLoadingMessages,
        refreshHistory: loadHistory,
        fetchInitialMessages,
        loadMoreMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};