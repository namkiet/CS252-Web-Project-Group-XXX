import { hisService } from '@/services/history.service';
import { useChatContext } from '@/context/chat-context';
import { type ScheduleDay } from '../types';

export function useHistory(defaultSchedule: ScheduleDay[]) {
  const {
    chatStore,
    setChatStore,
    currentIdChat,
    setCurrentIdChat,
  } = useChatContext();

  // --------------------------------------ADD CONVERSATION------------------------------------
  const addConversation = async () => {
    const created = await hisService.addSession('New Conversation');
    const newSession = created?.data;

    setChatStore(prev => {
      const next = [...prev];
      const newConv = {
        id: newSession?.id || "",
        title: newSession?.title || `Conversation ${prev.length + 1}`,
        messages: [],
        is_pinned: false,
        schedule: defaultSchedule,
        savedSchedule: [...defaultSchedule],
        suggestedDish: [],
        isLoaded: true
      } as any;
      next.push(newConv);
      return next;
    });
    setCurrentIdChat(chatStore.length);
  };
  // ---------------------------------------DELETE SESSION--------------------------------------
  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const isDelete = await hisService.deleteSession(sessionId);
      if (isDelete) {
        const newChatStore = chatStore.filter((chat) => chat.id !== sessionId);
        if (newChatStore.length === 0) {
          setChatStore([{
            id: "",
            is_pinned: false,
            title: "New Conversation",
            messages: [],
            schedule: defaultSchedule,
            isLoaded: true
          }]);
          setCurrentIdChat(0);
        } else {
          setChatStore(newChatStore);
          setCurrentIdChat(0);
        }
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };
  // ---------------------------------------RENAME SESSION--------------------------------------
  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    setChatStore(prev => prev.map(chat =>
      chat.id === sessionId ? { ...chat, title: newTitle } : chat
    ));

    try {
      await hisService.renameSession(sessionId, newTitle);
    } catch (error) {
      console.error("Error renaming:", error);
    }
  };

  // ---------------------------------------TOGGLE PIN------------------------------------------
  const handleTogglePin = async (sessionId: string, is_pinned: boolean) => {
    setChatStore(prev => prev.map(chat =>
      chat.id === sessionId ? { ...chat, is_pinned: is_pinned } : chat
    ));

    try {
      await hisService.updateSession(sessionId, { is_pinned: is_pinned });
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  // ----------------------------------------SAVE SCHEDULE-----------------------------------------
  const saveScheduleAsJSON = () => {
    const activeSession = chatStore[currentIdChat];
    if (!activeSession || !activeSession.schedule) return null;

    const scheduleData = activeSession.schedule;
    return {
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
  };

  const handleSaveSchedule = async () => {
    const activeSession = chatStore[currentIdChat];
    if (!activeSession?.id || !activeSession.isLoaded) return;

    const scheduleJSON = saveScheduleAsJSON();
    if (!scheduleJSON) return;

    try {
      const isSuccess = await hisService.updateSchedule(activeSession.id, scheduleJSON);
      if (isSuccess) {
        setChatStore(prev => {
          const newStore = [...prev];
          const conv = newStore[currentIdChat];
          if (conv) {
            newStore[currentIdChat] = {
              ...conv,
              savedSchedule: JSON.parse(JSON.stringify(conv.schedule))
            } as any;
          }
          return newStore;
        });
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };
  // -------------------------------------------UNDO SCHEDULE---------------------------------------
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

  return {
    addConversation,
    handleDeleteSession,
    handleRenameSession,
    handleTogglePin,
    handleSaveSchedule,
    handleUndoSchedule,
    saveScheduleAsJSON
  };
}