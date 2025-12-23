import { useTranslation } from "react-i18next"
import { type LucideIcon,  SquarePen } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/shared/components/ui/sidebar"

type NavMainProps = {
  addConversation: () => void
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}

export function NavMain({ items, addConversation }: NavMainProps) {
  const { t } = useTranslation();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive} tooltip={t(item.title)}>
            <a href={item.url}>
              <item.icon />
              <span>{t(item.title)}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

        <SidebarMenuItem >
          <SidebarMenuButton
            onClick={addConversation}
            className="font-medium py-0"
            tooltip={t('chat.leftsidebar.new_chat')}
          >
            <SquarePen className="size-5" />
            <span>{t('chat.leftsidebar.new_chat')}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

    </SidebarMenu>

  )
}
