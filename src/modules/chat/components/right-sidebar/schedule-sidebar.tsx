import * as React from "react"

import { useTranslation } from "react-i18next";
import { Calendar, Trash2, Map as MapIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/shared/components/ui/sidebar"
import { cn } from "@/shared/lib/utils";
import{ ScheduleFooter } from './schedule-footer'
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { FoodItem, ScheduleItem, ScheduleDay } from "../../types"
import {ScheduleFoodCard} from './schedule-food-card'

interface ScheduleSidebarProps extends React.ComponentProps<typeof Sidebar> {
  schedule: ScheduleDay[];
  scheduleList?: ScheduleDay[][];
  onRemoveItem: (id: string) => void;
  onAddDay: (day:number) => void;
  onAddInDay: (daynumber: number, position: number |ScheduleItem, activity: string, food: FoodItem | null) => void ;
  scheduleItemSelected: ScheduleItem | number | null;
  setScheduleItemSelected: (item: ScheduleItem | number | null) => void;
  foodCardSelected: FoodItem | null;
  setFoodCardSelected: (item: FoodItem | null) => void;
  onShowMap?: (item: FoodItem) => void;
  onRemoveDay: (day: number) => void;
  onShowDayMap?: (daySchedule: ScheduleDay) => void;
  onSwapItems?: (item1: ScheduleItem, item2: ScheduleItem) => void;
  swappedItemIds?: string[];
  onSaveSchedule?: () => void;
  onUndoSchedule?: () => void;
}

export function ScheduleSidebar({
  schedule = [],
  scheduleList = [],
  onRemoveItem,
  onAddDay,
  onAddInDay,
  scheduleItemSelected,
  setScheduleItemSelected,
  foodCardSelected,
  setFoodCardSelected,
  onShowMap,
  onRemoveDay,
  onShowDayMap,
  onSwapItems,
  swappedItemIds = [],
  onSaveSchedule,
  onUndoSchedule,
  className,
  ...props
}: ScheduleSidebarProps) {

  const { t } = useTranslation();
  const AddDay = () => {
    const targetDay = scheduleItemSelected === null
      ? -1
      : typeof scheduleItemSelected === "number"
        ? scheduleItemSelected
        : scheduleItemSelected.day;
    onAddDay(targetDay);
  };

  const AddInDay = () => {
    const defaultActivity = t('chat.rightsidebar.activity_default');
    if (scheduleItemSelected === null) {
      onAddInDay(-1, -1, defaultActivity, null);
    } else if (typeof scheduleItemSelected === "number") {
      onAddInDay(scheduleItemSelected, -1, defaultActivity, null);
    } else {
      onAddInDay(scheduleItemSelected.day,scheduleItemSelected, defaultActivity, null);
    }
  };

  // Detect if schedule has changed from saved version
  const canUndo = Array.isArray(scheduleList) && scheduleList.length > 1;

  const handleDrop = (e: React.DragEvent, dayNumber: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove(
      "bg-blue-50",
      "border-blue-500",
      "shadow-md"
    );

    if (foodCardSelected) {
      onAddInDay(dayNumber, -1, "", foodCardSelected);
      setFoodCardSelected(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add(
      "bg-blue-50",
      "border-blue-500",
      "shadow-md"
    );
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove(
      "bg-blue-50",
      "border-blue-500",
      "shadow-md"
    );
  };

  return (
    <Sidebar
      collapsible="none"
      className={cn("sticky top-0 h-full w-full border-l bg-white", className)}
      {...props}
    >
      <SidebarHeader className="p-0">  
        {/* Header here */}
        <div className="border-sidebar-border border-b p-4 md:p-6 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h2 className="font-semibold text-lg text-gray-800">{t('chat.rightsidebar.header.title')}</h2>
            </div>
            <button
              onClick={onUndoSchedule}
              disabled={!canUndo}
              className={cn(
                "h-7 px-2.5 text-xs font-medium rounded transition-colors",
                canUndo
                  ? "text-white bg-orange-500 hover:bg-orange-600"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              )}
            >
              {t('chat.rightsidebar.header.undo')}
            </button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1 p-3 md:p-4">
          <div className="space-y-4 md:space-y-5">
            {schedule.length === 0 ? (
              <div className="text-center py-10 md:py-20">
                <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-full w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 md:h-10 md:w-10 text-orange-400" />
                </div>
                <p className="text-sm text-orange-500 px-4">{t('chat.rightsidebar.empty_state.title')}</p>
              </div>
            ) : (
              schedule.map((dayItem) => {
                const isDaySelected =
                  typeof scheduleItemSelected === "number" &&
                  scheduleItemSelected === dayItem.day;

                return (
                <Card
                  key={dayItem.day}
                  className={cn(
                    "overflow-hidden border transition-all duration-300 rounded-xl cursor-pointer p-1.5",
                    "min-h-10",
                    isDaySelected && "border-orange-500/70 bg-orange-50 shadow-md"
                  )}
                  onClick={() => setScheduleItemSelected(dayItem.day)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dayItem.day)}
                >
                  {/* Day Header */}
                  <div
                    className={cn(
                      "flex items-center justify-between px-3 pb-1 pt-2 border-b bg-white transition-colors",
                      isDaySelected && "bg-orange-50 border-orange-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "bg-orange-500 text-white",
                          isDaySelected && "ring-2 ring-orange-300/70"
                        )}
                      >
                        {t('chat.rightsidebar.day_label', { day: dayItem.day })}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      {onShowDayMap && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowDayMap(dayItem);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                          title={t('chat.rightsidebar.tooltips.see_day_map', { day: dayItem.day })}
                        >
                          <MapIcon className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveDay(dayItem.day);
                        }}
                        className="p-1.5 bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                        title={t('chat.rightsidebar.tooltips.delete_day', { day: dayItem.day })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Activities inside day */}
                  <div
                    className={cn(
                      "space-y-3 transition-all duration-300",
                      "py-1"
                    )}
                  >
                    {dayItem.scheduleInDay.length === 0 ? (
                      <div className="text-center text-gray-400 select-none">
                        <p className="text-xs">{t('chat.rightsidebar.empty_state.drop_here')}</p>
                      </div>
                    ) : (
                      dayItem.scheduleInDay.map((item, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "transition-all duration-200 rounded-lg cursor-pointer",
                            scheduleItemSelected === item
                              ? "[&_.bg-white]:!bg-orange-50 shadow-md transform scale-[1.02]"
                              : "hover:shadow-sm"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setScheduleItemSelected(item);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              {item.food ? (
                                <ScheduleFoodCard
                                  food={item.food}
                                  onRemove={() => onRemoveItem(item.id || item.food?.id || "")}
                                  onShowMap={onShowMap}
                                  isSwapMode={Boolean(scheduleItemSelected && typeof scheduleItemSelected !== "number" && onSwapItems)}
                                  isSelected={scheduleItemSelected === item}
                                  onSwap={
                                    scheduleItemSelected && typeof scheduleItemSelected !== "number" && scheduleItemSelected !== item && onSwapItems
                                      ? () => onSwapItems(scheduleItemSelected, item)
                                      : undefined
                                  }
                                  isSwapping={swappedItemIds.includes(item.id || item.food?.id || "")}
                                />
                              ) : (
                                <p className="text-sm font-medium text-gray-800">
                                  {item.activity || t('chat.rightsidebar.activity_default')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )})
            )}

          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <ScheduleFooter AddDay={AddDay} AddInDay={AddInDay}/>
      </SidebarFooter>
    </Sidebar>
  )
}