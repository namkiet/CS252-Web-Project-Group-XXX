import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MoreHorizontal,
  Pin,
  Trash2,
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
  is_pinned: boolean;
  currentTitle: string;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onTogglePin: (id: string, is_pinned: boolean) => void;
}

export function HistoryActionsMenu({ isMobile, sessionId, onDelete, currentTitle, onRename, is_pinned, onTogglePin }: HistoryActionsMenuProps) {
  const { t } = useTranslation();
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
          <span className="sr-only">{t('chat.leftsidebar.actions.more')}</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
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
            onTogglePin(sessionId, !is_pinned);
          }}
          >
          <Pin 
            className={`mr-2 h-4 w-4 transition-all duration-300 ${
              is_pinned 
                ? "fill-orange-500 text-orange-500 rotate-45" 
                : "text-orange-500"
            }`} 
          />
          <span>{is_pinned ? t('chat.leftsidebar.actions.unpin') : t('chat.leftsidebar.actions.pin')}</span>
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
          <span>{t('chat.leftsidebar.actions.rename')}</span>
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
          <span>{t('chat.leftsidebar.actions.delete')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
      <DialogContent
        className="sm:max-w-[400px] rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-50/30 px-6 py-4 border-b border-orange-100/50">
          <DialogHeader className="gap-0">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-orange-100/80 rounded-lg">
                <Pencil className="h-4 w-4 text-orange-600" />
              </div>
              <DialogTitle className="text-lg font-bold text-orange-800 tracking-tight">
                {t('chat.leftsidebar.rename_modal.title')}
              </DialogTitle>
            </div>
            <DialogDescription className="text-orange-600/70 text-[13px] ml-[40px] leading-tight font-medium">
              {t('chat.leftsidebar.rename_modal.desc')}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-5">
          <Input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('chat.leftsidebar.rename_modal.placeholder')}
            className="
              h-11 px-4 bg-zinc-50 border-zinc-200 text-orange-800 rounded-lg
              focus-visible:ring-orange-200 focus-visible:border-orange-300
              transition-all duration-200 shadow-sm text-sm
              selection:bg-orange-200 selection:text-orange-900
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
        
        <DialogFooter className="px-6 py-3 bg-zinc-50/50 gap-2 sm:gap-2">
          <Button 
            variant="ghost" 
            onClick={() => setIsRenameOpen(false)}
            className="
              h-9 rounded-lg px-4
              text-zinc-500 hover:text-orange-700 
              hover:bg-orange-50 
              font-medium text-sm transition-all duration-200
            "
          >
            {t('chat.leftsidebar.rename_modal.cancel')}
          </Button>
          <Button 
            onClick={handleSaveRename}
            className="
              h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6
              font-semibold shadow-sm active:scale-95 transition-all text-sm
            "
          >
            {t('chat.leftsidebar.rename_modal.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}