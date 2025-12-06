import * as React from "react"
import {
  Home,
  MessageCircleQuestion,
  Settings,
} from "lucide-react"

import { NavMain } from "./nav-main.tsx"
import { NavSecondary } from "./nav-secondary.tsx"
import { NavHistory } from "./nav-history.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/shared/components/ui/sidebar"

import type { Conversation } from '../../types'

// This is sample data.
const data = {
  navMain: [
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
  setCurrentIdChat: (id: number) => void;
  addConversation: () => void;
  onDeleteSession: (id: string) => void;
} & React.ComponentProps<typeof Sidebar>;

export function SidebarLeft({ chatStore, setCurrentIdChat, addConversation, onDeleteSession }: SidebarLeftProps) {

  const historyItems = chatStore.map((c, index) => ({
    name: c.title || `Conversation ${index + 1}`,
    id : index,
    sessionId: c.id,
    url: "#",
    emoji: "💬",
  }));
  return (
    <Sidebar className="border-r-0" >
      <SidebarHeader>
        <NavMain items={data.navMain} addConversation={addConversation} />
      </SidebarHeader>
      <SidebarContent>
        <NavHistory
          history={historyItems} 
          setCurrentIdChat={setCurrentIdChat}
          onDeleteSession={onDeleteSession}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
