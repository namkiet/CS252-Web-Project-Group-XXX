import { Button } from "@/shared/components/ui/button"
import { PanelRightClose, PanelRightOpen } from "lucide-react"

type ChatHeaderProps = {
  title: string;
  isScheduleSidebarOpen: boolean;
  onToggleScheduleSidebar: () => void;
}

export function ChatHeader({title, isScheduleSidebarOpen, onToggleScheduleSidebar} :ChatHeaderProps) {
  return (
    <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b px-4 z-10">
      <div className="flex flex-1 items-center gap-2 px-3">
        <span className="font-semibold text-gray-700">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleScheduleSidebar}
          className="h-8 w-8 p-0 hover:bg-gray-100 transition-all duration-200"
        >
          <div className="transition-transform duration-200 ease-in-out">
            {isScheduleSidebarOpen ? (
              <PanelRightClose className="h-4 w-4 transition-all duration-200" />
            ) : (
              <PanelRightOpen className="h-4 w-4 transition-all duration-200" />
            )}
          </div>
        </Button>
      </div>
    </header>
  )
}