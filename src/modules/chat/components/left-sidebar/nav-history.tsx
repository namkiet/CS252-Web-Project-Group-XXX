"use client"

import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
  PlusCircle,
  MessageSquare
} from "lucide-react"

type HistoryItem = {
  name: string,
  id: string,
  url: string,
  emoji: string,
};

type NavHistoryProps = {
  history: HistoryItem[];
  children?: React.ReactNode;
  setCurrentIdChat: (id: string) => void;
  addConversation: () => void;
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar"

function NavHistory({ history, setCurrentIdChat, addConversation, children } : NavHistoryProps) { 
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{children}</SidebarGroupLabel>
      {/* New Chat */}
      <SidebarMenuItem>
        <SidebarMenuButton onClick={addConversation}>
          <span><PlusCircle className="w-5 h-5" /></span>
          <span>Add New Chat</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <div className="px-2 py-2 text-xs font-medium text-muted-foreground">
       Chat history
      </div>

      <SidebarMenu>
        {history.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton onClick={() => setCurrentIdChat(item.id)} asChild>
              <a href={item.url} title={item.name}>
                {/* <span>{item.emoji}</span> */}
                <span><MessageSquare className="w-5 h-5"/></span>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavHistory };