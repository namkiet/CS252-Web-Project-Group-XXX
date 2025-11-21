import * as React from "react"

import { Calendar, MapPin, Star, Trash2 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/shared/components/ui/sidebar"

import { Button } from "@/shared/components/ui/button"
import type { FoodItem } from '../../types'

interface ScheduleSidebarProps extends React.ComponentProps<typeof Sidebar> {
  scheduleItems: FoodItem[];
  onRemoveItem: (id: string) => void;
}

export function ScheduleSidebar({
  scheduleItems = [],
  onRemoveItem,
  ...props
}: ScheduleSidebarProps) {
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
          <p className="text-sm text-zinc-600">
            No schedule yet.
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Content here */}
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">
            Start chatting to generate your personalized travel schedule
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter>
        {/* Footer here */}
        Footer here
      </SidebarFooter>
    </Sidebar>
  )
}
