"use client"

import {
  Link,
  MoreHorizontal,
  Star,
  Trash2,
  MessageSquare
} from "lucide-react"

type HistoryItem = {
  name: string,
  id:number,
  url: string,
  emoji: string,
};

type NavHistoryProps = {
  history: HistoryItem[];
  children?: React.ReactNode;
  setCurrentIdChat: (id: number) => void;
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
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar"

function NavHistory({ history,setCurrentIdChat } : NavHistoryProps) {  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      

      <div className="px-2 pt-0 py-2 text-xs font-medium text-muted-foreground">
       Chat history
      </div>

      <SidebarMenu>
        {history.map((item) => (
          <SidebarMenuItem key={item.name}>
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
                  <Star className="text-muted-foreground" />
                  <span>Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-muted-foreground" />
                  <span>Rename</span>
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
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavHistory };