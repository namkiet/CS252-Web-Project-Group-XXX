import { MessageSquare } from "lucide-react"
import { HistoryActionsMenu } from "./his-actions-menu";

type HistoryItem = {
  name: string,
  id: number,
  sessionId: string,
  url: string,
  emoji: string,
};

type NavHistoryProps = {
  history: HistoryItem[];
  children?: React.ReactNode;
  setCurrentIdChat: (id: number) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
};

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar"

function NavHistory({ history, setCurrentIdChat, onDeleteSession, onRenameSession } : NavHistoryProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="px-2 pt-0 py-2 text-xs font-medium text-muted-foreground">
        Chat history
      </div>

      <SidebarMenu>
        {history.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton onClick={() => setCurrentIdChat(item.id)} asChild>
              <a href={item.url} title={item.name}>
                <span><MessageSquare className="w-5 h-5"/></span>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            
            <HistoryActionsMenu
              isMobile={isMobile}
              sessionId={item.sessionId}
              currentTitle={item.name}
              onDelete={onDeleteSession}
              onRename={onRenameSession}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavHistory };