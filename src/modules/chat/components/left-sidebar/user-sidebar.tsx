import * as React from "react"
import {
  Home,
  MessageCircleQuestion,
  Settings,
  Menu
} from "lucide-react"

import { NavMain } from "./nav-main.tsx"
import { NavSecondary } from "./nav-secondary.tsx"
import { NavHistory } from "./nav-history.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/shared/components/ui/sidebar"

import type { Conversation } from '../../types'

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
  onRenameSession: (id: string, newTitle: string) => void;
  onTogglePin: (id: string, is_pinned: boolean) => void;
} & React.ComponentProps<typeof Sidebar>;

export function SidebarLeft({ chatStore, setCurrentIdChat, addConversation, onDeleteSession, onRenameSession, onTogglePin }: SidebarLeftProps) {
  const { toggleSidebar } = useSidebar()

  const historyItems = chatStore.map((c, index) => ({
    name: c.title || `Conversation ${index + 1}`,
    id : index,
    sessionId: c.id,
    url: "#",
    emoji: "💬",
    is_pinned: c.is_pinned
  }));

  return (
    <Sidebar collapsible="icon" className="border-r-0" >
      <SidebarHeader className="pt-20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={toggleSidebar}
              tooltip="Close Sidebar"
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <Menu className="size-4" /> 
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={data.navMain} addConversation={addConversation} />
      </SidebarHeader>
      <SidebarContent>
        <NavHistory
          history={historyItems} 
          setCurrentIdChat={setCurrentIdChat}
          onDeleteSession={onDeleteSession}
          onRenameSession={onRenameSession}
          onTogglePin={onTogglePin}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
