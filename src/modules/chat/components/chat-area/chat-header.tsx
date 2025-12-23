import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button"
import { PanelRightClose, PanelRightOpen } from "lucide-react"

type ChatHeaderProps = {
  title: string;
  isScheduleSidebarOpen: boolean;
  onToggleScheduleSidebar: () => void;
}

export function ChatHeader({title, isScheduleSidebarOpen, onToggleScheduleSidebar} :ChatHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center justify-between gap-2 h-full">
      <div className="flex flex-1 items-center gap-2 px-0 md:px-2 min-w-0">
        <span className="font-semibold text-gray-700 truncate text-sm md:text-base">
          {title}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleScheduleSidebar}
          className="hidden lg:flex h-8 w-8 p-0 hover:bg-gray-100 transition-all duration-200"
          title={t('chat.area.header.toggle_sidebar')}
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
    </div>
  )
}