import * as React from "react"
import {
  Home,
  MessageCircleQuestion,
  Settings,
  Sparkles,
} from "lucide-react"

import { NavMain } from "./nav-main.tsx"
import { NavSecondary } from "./nav-secondary.tsx"
import { NavHistory } from "./nav-history.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar"

import type { Conversation } from '../../types'

// This is sample data.
const data = {
  navMain: [
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
}
type SidebarLeftProps = {
  chatStore: Conversation[];
  setCurrentIdChat: (id: string) => void;
  addConversation: () => void;
} & React.ComponentProps<typeof Sidebar>;

export function SidebarLeft({ chatStore, setCurrentIdChat, addConversation }: SidebarLeftProps) {

  const historyItems = chatStore.map((c, index) => ({
    name: c.title || `Conversation ${index + 1}`,
    id : String(c.id),
    url: "#",
    emoji: "💬",
  }));
  return (
    <Sidebar className="border-r-0" >
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavHistory history={historyItems} setCurrentIdChat={setCurrentIdChat} addConversation={addConversation}></NavHistory>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
