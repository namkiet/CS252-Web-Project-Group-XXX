import * as React from "react"

import { Calendar} from 'lucide-react';

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
  onRemoveItem: (id: string) => void;
  onAddDay: (day:number) => void;
  onAddInDay: (daynumber: number, position: number |ScheduleItem, activity: string, food: FoodItem | null) => void ;
  scheduleItemSelected: ScheduleItem|null;
  setScheduleItemSelected: (item: ScheduleItem|null) => void ;
  foodCardSelected: FoodItem | null ;
  setFoodCardSelected: (item: FoodItem | null) => void ;
}

export function ScheduleSidebar({
  schedule = [],
  onRemoveItem,
  onAddDay,
  onAddInDay,
  scheduleItemSelected,
  setScheduleItemSelected,
  foodCardSelected,
  setFoodCardSelected,
  ...props
}: ScheduleSidebarProps) {


  const AddDay = () => {
    const targetDay = scheduleItemSelected === null ? -1 : scheduleItemSelected.day;
    onAddDay(targetDay);
    if (scheduleItemSelected !== null) console.log(scheduleItemSelected.day)
  };

  const AddInDay = () => {
    if (scheduleItemSelected === null) {
      onAddInDay(-1, -1, "Activity", null);
    } else {
      onAddInDay(scheduleItemSelected.day,scheduleItemSelected, "Activity", null);
      console.log(scheduleItemSelected.day)
    }
  };

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
      className="sticky top-0 hidden h-svh border-l lg:flex w-1/4"
      {...props}
    >
      <SidebarHeader className="p-0">  
        {/* Header here */}
        <div className="border-sidebar-border border-b p-6 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2>Your Schedule</h2>
          </div>
        </div>
      </SidebarHeader>

         <SidebarContent>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-5">

            {schedule.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-100 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Start chatting to build your plan</p>
              </div>
            ) : (
              schedule.map((dayItem) => (
                <Card
                  key={dayItem.day}
                  className={cn(
                    "overflow-hidden border-2 transition-all duration-300 rounded-xl cursor-pointer p-1.5",
                    "min-h-10"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dayItem.day)}
                >
                  {/* Day Header */}
                  <div className="px-3 pb-1 border-b bg-white">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        Day {dayItem.day}
                      </Badge>
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
                        <p className="text-xs">Drop something here</p>
                      </div>
                    ) : (
                      dayItem.scheduleInDay.map((item, idx) => (
                        <Card
                          key={idx}
                          className={cn(
                            "p-2.5 hover:shadow-md transition cursor-pointer border",
                            scheduleItemSelected === item ? "border-blue-500 shadow-lg" : ""
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setScheduleItemSelected(item);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              {item.food ? (
                                <ScheduleFoodCard food={item.food} />
                              ) : (
                                <p className="text-sm font-medium text-gray-800">
                                  {item.activity || "Activity"}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              ))
            )}

          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <ScheduleFooter AddDay={AddDay} AddInDay={AddInDay}>
        </ScheduleFooter>
      </SidebarFooter>
    </Sidebar>
  )
}