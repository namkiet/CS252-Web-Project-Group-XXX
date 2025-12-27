import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { locations } from '../data/location-data';
import { dishes } from '../data/dish-data';
import type { DishData } from '../index';
import { Map } from 'lucide-react';
import { useChatContext } from '@/context/chat-context';
import { hisService } from '@/services/history.service';

import { MainHeader } from '../components/main-header';
import { CategoryTabs } from '../components/category-tabs';
import { DishSectionList } from '../components/dish-section-list';
import { LocationSidebar } from '../components/location-sidebar';
import { DishDetailModal } from '../components/dish-detail-modal';
import { Button } from '@/shared/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/shared/components/ui/sheet";

export default function FoodGuidePage() {
  const { t } = useTranslation();

  // --- HOOKS ---
  const { chatStore, setCurrentIdChat, setChatStore } = useChatContext();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'vietnam' | 'international'>('vietnam');
  const [selectedDish, setSelectedDish] = useState<DishData | null>(null);
  const [activeLocation, setActiveLocation] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- LOGIC ---
  const isManualScrolling = useRef(false);
  const filteredLocations = locations.filter(loc => loc.category === activeTab);

  const handlePrefillDishToChat = async (dish: DishData, conversationIndex: number) => {
    if (conversationIndex === -1) {
      const defaultSchedule = [{ day: 1, scheduleInDay: [] }];
      const convTitle = t('guide.modal.conv_index', { index: chatStore.length + 1 });
      const created = await hisService.addSession(convTitle);
      const newSession = created?.data;

      const newConversation = {
        id: newSession?.id || "",
        title: newSession?.title || convTitle,
        messages: [],
        schedule: defaultSchedule,
        scheduleList: [JSON.parse(JSON.stringify(defaultSchedule))],
        suggestedDish: [dish.name]
      } as any;

      setChatStore(prev => [...prev, newConversation]);
      setCurrentIdChat(chatStore.length);
      return;
    }

    const conversation = chatStore[conversationIndex];
    if (!conversation) return;

    setCurrentIdChat(conversationIndex);

    // Also push into suggestedDish array for that conversation
    setChatStore(prev => {
      const next = [...prev];
      const conv = next[conversationIndex];
      if (!conv) return prev;
      const list = conv.suggestedDish || [];
      if (!list.includes(dish.name)) {
        next[conversationIndex] = { ...conv, suggestedDish: [...list, dish.name] } as any;
      }
      return next;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const locationId = entry.target.id.replace('location-', '');
            setActiveLocation(locationId);
          }
        });
      },
      {
        root: null,
        rootMargin: '-100px 0px -80% 0px', 
        threshold: 0
      }
    );
    filteredLocations.forEach((loc) => {
      const element = document.getElementById(`location-${loc.id}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [filteredLocations]);

  const handleScrollToLocation = (locationId: string) => {
    isManualScrolling.current = true;
    setActiveLocation(locationId);
    setIsMobileMenuOpen(false);

    const element = document.getElementById(`location-${locationId}`);
    if (element) {
      const offset = window.innerWidth < 768 ? 100 : 140; 
      const offsetTop = element.offsetTop - offset;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    
    setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      
      {/* Header */}
      <MainHeader />

      {/* Tabs */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md py-2 border-b border-orange-100 shadow-sm">
        <CategoryTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          <div className="w-full lg:w-3/4">
            <DishSectionList 
              locations={filteredLocations}
              allDishes={dishes}
              onDishClick={setSelectedDish}
            />
          </div>

          <div className="hidden lg:block lg:w-1/4 relative">
            <div className="sticky top-32">
              <LocationSidebar 
                locations={filteredLocations}
                activeLocationId={activeLocation}
                activeTab={activeTab}
                onScrollToLocation={handleScrollToLocation}
              />
            </div>
          </div>
          
        </div>
      </div>

      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full w-14 h-14 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
             <SheetHeader className="mb-4 text-left">
                <SheetTitle>{t('guide.mobile.select_location')}</SheetTitle>
                <SheetDescription>{t('guide.mobile.jump_to_region')}</SheetDescription>
             </SheetHeader>
             <div className="overflow-y-auto h-full pb-10">
                <LocationSidebar 
                    locations={filteredLocations}
                    activeLocationId={activeLocation}
                    activeTab={activeTab}
                    onScrollToLocation={handleScrollToLocation}
                  />
             </div>
          </SheetContent>
        </Sheet>
      </div>

      <DishDetailModal 
        dish={selectedDish} 
        onClose={() => setSelectedDish(null)}
        onPrefillDishToChat={handlePrefillDishToChat}
      />

      <footer className="bg-white border-t border-orange-100 mt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            {t('guide.footer.explore_text')}
          </p>
        </div>
      </footer>
      
    </div>
  );
}