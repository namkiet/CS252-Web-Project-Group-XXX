import { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Star,
  Trash2,
  Link as LinkIcon,
  Pencil
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"

import { SidebarMenuAction } from "@/shared/components/ui/sidebar"

interface HistoryActionsMenuProps {
  isMobile: boolean;
  sessionId: string;
  currentTitle: string;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export function HistoryActionsMenu({ isMobile, sessionId, onDelete, currentTitle, onRename }: HistoryActionsMenuProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState(currentTitle);

  useEffect(() => {
    setNewName(currentTitle);
  }, [currentTitle]);

  const handleSaveRename = () => {
    if (newName.trim() && newName !== currentTitle) {
      onRename(sessionId, newName);
    }
    setIsRenameOpen(false);
  };

  return (
    <>
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

        <DropdownMenuItem 
          className="
            cursor-pointer 
            text-orange-500
            transition-all duration-200 ease-in-out

            focus:bg-orange-100
            focus:text-orange-600
            focus:font-bold
            focus:scale-105
            focus:shadow-md
            "
          onClick={(e) => {
            e.stopPropagation();
            setNewName(currentTitle);
            setIsRenameOpen(true);
          }}
        >
          <Pencil className="text-muted-foreground mr-2 h-4 w-4 text-orange-500" />
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

    <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
      <DialogContent
        className="sm:max-w-[425px] to-white border-orange-150 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-orange-700">Rename Chat</DialogTitle>
          <DialogDescription className="text-orange-400">
            Enter a new name for this conversation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="
              col-span-3 bg-white border-orange-200
              focus-visible:ring-orange-200
              placeholder:text-orange-300
              selection:bg-blue-500 selection:text-white
            "
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSaveRename();
              }
            }}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => setIsRenameOpen(false)}
            className="text-orange-700 hover:text-orange-900 hover:bg-orange-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRename}
            className="
              bg-orange-100 
              border border-orange-500 
              text-orange-700 
              hover:bg-orange-200 
              hover:text-orange-900
              transition-colors
            "
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}