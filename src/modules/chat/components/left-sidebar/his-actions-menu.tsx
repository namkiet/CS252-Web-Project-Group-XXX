import {
  MoreHorizontal,
  Star,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

import { SidebarMenuAction } from "@/shared/components/ui/sidebar"

interface HistoryActionsMenuProps {
  isMobile: boolean;
  sessionId: string;
  onDelete: (id: string) => void;
}

export function HistoryActionsMenu({ isMobile, sessionId, onDelete }: HistoryActionsMenuProps) {
  return (
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
            <LinkIcon className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="
            cursor-pointer 
            text-red-500 
            transition-all duration-200 ease-in-out

            focus:bg-red-100
            focus:text-red-500
            focus:font-bold
            focus:scale-105
            focus:shadow-md
          "
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sessionId);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}