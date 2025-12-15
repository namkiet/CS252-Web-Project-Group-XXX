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
    return msgs.map((m: any) => {
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
              data: rawPayload.map((item: any) => ({
                  id: crypto.randomUUID(),
                  restaurant_name: item.restaurant_name || "Nhà hàng",
                  image: item.image || "", 
                  desc: item.desc || item.description || "",
                  address: item.address || "",
                  star: Number(item.star || 0),
                  dish_name: item.dish_name || "",
                  priceRange: item.priceRange || "",
                  openTime: "",
              }))
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
        messages: [],
        hasMore: true,
        offset: 0,
        isLoaded: false,
        schedule: [{ day: 1, scheduleInDay: [] }]
      } as any));

      setChatStore(conversations);
      setIsLoadedSessions(true);
      
    } catch (error) {
      console.error("Lỗi load session:", error);
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
        const data = await hisService.chatHistory(sessionId, 10, 0);
        
        if (data.status === "success") {
            const rawMsgs = data.messages || [];
            
            const parsed = mapMessages(rawMsgs).reverse();

            setChatStore(prev => {
                const newStore = [...prev];
                newStore[index] = {
                    ...newStore[index],
                    messages: parsed,
                    offset: rawMsgs.length,
                    hasMore: rawMsgs.length >= 10,
                    isLoaded: true
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