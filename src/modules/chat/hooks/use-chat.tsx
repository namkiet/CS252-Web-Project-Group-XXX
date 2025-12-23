import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { chatService } from "../../../services/chat.service";
import type { Message } from '../types'
import { flushSync } from 'react-dom';

import { useChatContext } from '@/context/chat-context';
import { useSchedule } from './use-schedule';

export function useChat() {
  const { t } = useTranslation();
  const { 
    chatStore, 
    setChatStore, 
    currentIdChat, 
    setCurrentIdChat, 
    isLoadingHistory,
    fetchInitialMessages
  } = useChatContext();

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scheduleData = useSchedule();
  
  useEffect(() => {
    const activeSession = chatStore[currentIdChat];
    if (chatStore.length > 0 && activeSession && activeSession.id) {
      fetchInitialMessages(currentIdChat);
    }
  }, [currentIdChat, chatStore.length, fetchInitialMessages]);

  useEffect(() => {
    const activeSession = chatStore[currentIdChat];
    if (activeSession && activeSession.id) {
      const key = `chat_draft_${activeSession.id}`;
      const draft = sessionStorage.getItem(key);
      if (draft !== null) {
        setInputValue(draft);
      }
    }
  }, [chatStore, currentIdChat]);

  // ------------------------------------SEND MESSAGE-----------------------------------
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

  const handleSendMessage = async () => {
    const activeSession = chatStore[currentIdChat];
    const suggested = activeSession?.suggestedDish || [];
    let userMessageContent = inputValue.trim();
    
    if (!inputValue.trim() && suggested.length === 0) return;

    if (suggested.length > 0) {
      userMessageContent = t('chat.area.prompt_prefix', { 
        dishes: suggested.join(', '), 
        input: inputValue.trim() 
      });
    }

    const userMsg: Message = {
      role: 'user',
      type: 'chat',
      content: userMessageContent,
      data: undefined,
    };
    addMessageToCurrentChat(userMsg);

    if (activeSession && activeSession.id) {
      sessionStorage.removeItem(`chat_draft_${activeSession.id}`);
    }

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

  // ------------------------------------ REMOVE SUGGESTION -----------------------------------
  const handleRemoveSuggestedDish = (indexToRemove: number) => {
    setChatStore(prev => {
      const newStore = [...prev];
      const activeSession = newStore[currentIdChat];
      
      if (activeSession && activeSession.suggestedDish) {
        const newSuggestions = activeSession.suggestedDish.filter((_, idx) => idx !== indexToRemove);
        
        newStore[currentIdChat] = {
          ...activeSession,
          suggestedDish: newSuggestions
        } as any;
      }
      return newStore;
    });
  };

  return {
    inputValue,
    setInputValue,
    isLoading: isLoading || isLoadingHistory,
    currentIdChat,
    chatStore,
    handleSendMessage,
    setCurrentIdChat,
    handleRemoveSuggestedDish,
    ...scheduleData
  }
}