import { MessageSquareText, Pin } from "lucide-react"
import { HistoryActionsMenu } from "./his-actions-menu";

type HistoryItem = {
  name: string,
  id: number,
  sessionId: string,
  url: string,
  emoji: string,
  is_pinned: boolean,
};

type NavHistoryProps = {
  history: HistoryItem[];
  children?: React.ReactNode;
  setCurrentIdChat: (id: number) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onTogglePin: (id: string, is_pinned: boolean) => void;
};

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar"

function NavHistory({ history, setCurrentIdChat, onDeleteSession, onRenameSession, onTogglePin } : NavHistoryProps) {
  const { isMobile } = useSidebar()

  const sortedHistory = [...history].sort((a, b) => {
    if (a.is_pinned === b.is_pinned) return 0;
    return a.is_pinned ? -1 : 1;
  });

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="px-2 pt-0 py-2 text-xs font-medium text-muted-foreground">
        Chat history
      </div>

      <SidebarMenu>
        {sortedHistory.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton onClick={() => setCurrentIdChat(item.id)} asChild>
              <a href={item.url} title={item.name} className="flex items-center gap-2">
                <span><MessageSquareText className="w-5 h-5"/></span>
                <span className="truncate">{item.name}</span>
                {item.is_pinned && <Pin className="ml-auto h-3 w-3 fill-orange-500 text-orange-500 rotate-45" />}
              </a>
            </SidebarMenuButton>
            
            <HistoryActionsMenu
              isMobile={isMobile}
              sessionId={item.sessionId}
              currentTitle={item.name}
              is_pinned={item.is_pinned}
              onDelete={onDeleteSession}
              onRename={onRenameSession}
              onTogglePin={onTogglePin}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavHistory };