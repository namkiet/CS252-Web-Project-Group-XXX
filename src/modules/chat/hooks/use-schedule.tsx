import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import type { FoodItem, ScheduleDay, ScheduleItem } from '../types'
import { useChatContext } from '@/context/chat-context';
import { useHistory } from './use-history';
import { calculateStarFromName } from '@/lib/star-calculator';

const parseBackendSchedule = (raw: any): any[] => {
  if (!raw) return [];

  const dayList = Array.isArray(raw) ? raw : (raw.dayList || raw.schedule || []);

  return dayList.map((dayItem: any, dayIdx: number) => {
    const dayNumber = Number(dayItem?.day) || dayIdx + 1;
    
    const rawDishList = dayItem?.['dish-list'] || dayItem?.scheduleInDay || [];
    const dishList = Array.isArray(rawDishList) ? rawDishList : [];

    const scheduleInDay = dishList.map((item: any, itemIdx: number) => {
      const lat = item?.coordinates?.lat ?? item?.lat;
      const lon = item?.coordinates?.lng ?? item?.lon ?? item?.lng;
      
      const safeId = item?.id || `sched_${dayNumber}_${itemIdx}_${Date.now()}`;

      const foodSource = item.food ? item.food : item;

      return {
        id: safeId,
        activity: item?.activity || '',
        day: dayNumber,
        food: {
          id: foodSource?.id || safeId,
          restaurant_name: foodSource?.restaurant_name || '',
          image: foodSource?.image || foodSource?.img || '',
          desc: foodSource?.desc || foodSource?.description || '',
          address: foodSource?.address || '',
          star: foodSource?.star ? Number(foodSource.star) : calculateStarFromName(foodSource?.restaurant_name || ''),
          dish_name: foodSource?.dish_name || '',
          priceRange: foodSource?.priceRange || foodSource?.price_range || foodSource?.price || '',
          openTime: foodSource?.openTime || '',
          coordinates: lat !== undefined && lon !== undefined ? { lat: Number(lat), lng: Number(lon) } : undefined,
        }
      };
    });

    return {
      day: dayNumber,
      scheduleInDay,
    };
  });
};

export function useSchedule() {
  const { 
    chatStore, 
    setChatStore, 
    currentIdChat, 
  } = useChatContext();

  const defaultSchedule = useMemo<ScheduleDay[]>(() => ([{ day: 1, scheduleInDay: [] }]), []);
  
  const schedule = chatStore[currentIdChat]?.schedule || defaultSchedule;
  const isLoaded = chatStore[currentIdChat]?.isLoaded || false;

  const [scheduleItemSelected, setScheduleItemSelected] = useState<ScheduleItem | number | null>(null)
  const [foodCardSelected, setFoodCardSelected] = useState<FoodItem | null>(null);
  const [isScheduleSidebarOpen, setIsScheduleSidebarOpen] = useState<boolean>(true)
  const [swappedItemIds, setSwappedItemIds] = useState<string[]>([])
  
  const [pendingSchedule, setPendingSchedule] = useState<any | null>(null);

  const history = useHistory(defaultSchedule);
  const isInitialMount = useRef(true);

  // ------------------------- AUTO SAVE LOGIC-------------------------
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!chatStore[currentIdChat]?.id || !isLoaded) return;

    const scheduleList = chatStore[currentIdChat]?.scheduleList as ScheduleDay[][] | undefined;
    const lastSnapshot = Array.isArray(scheduleList) && scheduleList.length > 0
      ? scheduleList[scheduleList.length - 1]
      : null;
    if (lastSnapshot && JSON.stringify(schedule) === JSON.stringify(lastSnapshot)) {
      return;
    }

    const timer = setTimeout(() => {
      history.handleSaveSchedule();
    }, 1500);

    return () => clearTimeout(timer);
  }, [schedule, currentIdChat, isLoaded]);

  // ------------------------- UPDATE SCHEDULE -------------------------
  const updateSchedule = (updater: (prev: ScheduleDay[]) => ScheduleDay[]) => {
    const next = updater(schedule);

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
  };

  const confirmUpdateSchedule = useCallback(() => {
    if (!pendingSchedule) return;

    const parsed = parseBackendSchedule(pendingSchedule);

    setChatStore(prev => {
      const newStore = [...prev];
      if (newStore[currentIdChat]) {
        newStore[currentIdChat] = {
          ...newStore[currentIdChat],
          schedule: parsed,
          scheduleList: [
            ...(newStore[currentIdChat].scheduleList || []),
            JSON.parse(JSON.stringify(parsed))
          ]
        } as any;
      }
      return newStore;
    });

    setPendingSchedule(null);
  }, [pendingSchedule, currentIdChat, setChatStore]);

  const cancelPendingSchedule = () => setPendingSchedule(null);

  // -------------------------------------- ADD DAY ----------------------------------------
  const onAddDay = (insertAtIndex: number = -1) => {
    updateSchedule(prev => {
      const insertPos = insertAtIndex === -1 || insertAtIndex >= prev.length ? prev.length : insertAtIndex < 0 ? 0 : insertAtIndex;
      const newDayNumber = insertPos === 0 ? 1 : prev[insertPos - 1].day + 1;

      const result: ScheduleDay[] = [];
      prev.forEach((dayObj, idx) => {
        if (idx < insertPos) {
          result.push(dayObj);
        } else {
          const shiftedDay = dayObj.day + 1;
          result.push({
            ...dayObj,
            day: shiftedDay,
            scheduleInDay: dayObj.scheduleInDay.map(item => ({ ...item, day: shiftedDay }))
          });
        }
      });

      result.splice(insertPos, 0, { day: newDayNumber, scheduleInDay: [] });
      return result;
    });
  };

  // ------------------------------------- ADD ACTIVITY IN DAY -------------------------------
  const onAddInDay = (dayNumber: number = -1, position: number | ScheduleItem = -1, activity: string = "", food: FoodItem | null = null) => {
    updateSchedule(prev => {
      if (prev.length === 0) return prev;
      if (food && prev.some(day => day.scheduleInDay.some(item => item.food?.id === food.id))) return prev;

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
        targetDay = dayNumber === -1 ? prev[prev.length - 1].day : dayNumber;
        insertPos = position as number;
      }

      const newItem: ScheduleItem = { 
        id: crypto.randomUUID(), 
        activity, 
        day: targetDay, 
        food: food ?? undefined 
      };

      return prev.map(dayObj => {
        if (dayObj.day !== targetDay) return dayObj;
        const items = [...dayObj.scheduleInDay];
        if (insertPos === -1 || insertPos >= items.length) items.push(newItem);
        else items.splice(Math.max(0, insertPos), 0, newItem);
        return { ...dayObj, scheduleInDay: items };
      });
    });
  };

  // ------------------------------------ ADD RESTAURANT TO SCHEDULE --------------------------------
  const handleAddToSchedule = (foodItem: FoodItem, targetDay?: number) => {
    updateSchedule(prev => {
      if (scheduleItemSelected && typeof scheduleItemSelected !== "number") {
        return prev.map(dayObj => ({
          ...dayObj,
          scheduleInDay: dayObj.scheduleInDay.map(item => item === scheduleItemSelected ? { ...item, food: foodItem } : item)
        }));
      }

      let dayToAdd = targetDay !== undefined && targetDay !== -1 ? targetDay : (typeof scheduleItemSelected === "number" ? scheduleItemSelected : (prev.length > 0 ? prev[prev.length - 1].day : 1));

      return prev.map(dayObj => {
        if (dayObj.day === dayToAdd) {
          return { 
            ...dayObj, 
            scheduleInDay: [
              ...dayObj.scheduleInDay, 
              { id: crypto.randomUUID(), activity: "", day: dayToAdd, food: foodItem }
            ] 
          };
        }
        return dayObj;
      });
    });
    setScheduleItemSelected(null);
  };

  // --------------------------------- REMOVE RESTAURANT ----------------------------------
  const handleRemoveFromSchedule = (idToRemove: string) => {
    if (!idToRemove) return;
    updateSchedule(prev => prev.map(day => ({
      ...day,
      scheduleInDay: day.scheduleInDay.filter(item => (item.id || item.food?.id) !== idToRemove)
    })));
  }

  // -------------------------------------- REMOVE DAY -------------------------------------
  const handleRemoveDay = (dayToRemove: number) => {
    updateSchedule(prev => {
      const filtered = prev.filter(d => d.day !== dayToRemove);
      return filtered.map((day, index) => ({
        ...day,
        day: index + 1,
        scheduleInDay: day.scheduleInDay.map(item => ({ ...item, day: index + 1 }))
      }));
    });
  };

  // -------------------------------------- SWAP ITEM --------------------------------------
  const handleSwapScheduleItems = (item1: ScheduleItem, item2: ScheduleItem) => {
    updateSchedule(prev => {
      let i1 = { d: -1, idx: -1 }, i2 = { d: -1, idx: -1 };
      prev.forEach(day => {
        const idx1 = day.scheduleInDay.findIndex(i => i === item1 || (i.id === item1.id && i.id));
        if (idx1 !== -1) i1 = { d: day.day, idx: idx1 };
        const idx2 = day.scheduleInDay.findIndex(i => i === item2 || (i.id === item2.id && i.id));
        if (idx2 !== -1) i2 = { d: day.day, idx: idx2 };
      });

      if (i1.d === -1 || i2.d === -1) return prev;

      const next = [...prev];
      if (i1.d === i2.d) {
        const dayIdx = next.findIndex(d => d.day === i1.d);
        const items = [...next[dayIdx].scheduleInDay];
        [items[i1.idx], items[i2.idx]] = [items[i2.idx], items[i1.idx]];
        next[dayIdx] = { ...next[dayIdx], scheduleInDay: items };
      } else {
        const d1Idx = next.findIndex(d => d.day === i1.d);
        const d2Idx = next.findIndex(d => d.day === i2.d);
        const items1 = [...next[d1Idx].scheduleInDay];
        const items2 = [...next[d2Idx].scheduleInDay];
        items1[i1.idx] = { ...item2, day: i1.d };
        items2[i2.idx] = { ...item1, day: i2.d };
        next[d1Idx] = { ...next[d1Idx], scheduleInDay: items1 };
        next[d2Idx] = { ...next[d2Idx], scheduleInDay: items2 };
      }
      return next;
    });

    const id1 = item1.id || item1.food?.id;
    const id2 = item2.id || item2.food?.id;
    if (id1 && id2) {
      setSwappedItemIds([id1, id2]);
      setTimeout(() => setSwappedItemIds([]), 900);
    }
    setScheduleItemSelected(null);
  };

  const toggleScheduleSidebar = () => setIsScheduleSidebarOpen(prev => !prev);

  return {
    schedule,
    onAddDay,
    onAddInDay,
    handleAddToSchedule,
    handleRemoveFromSchedule,
    handleRemoveDay,
    handleSwapScheduleItems,
    scheduleItemSelected,
    setScheduleItemSelected,
    foodCardSelected,
    setFoodCardSelected,
    isScheduleSidebarOpen,
    toggleScheduleSidebar,
    swappedItemIds,
    pendingSchedule,
    setPendingSchedule,
    confirmUpdateSchedule,
    cancelPendingSchedule,
    ...history
  };
}