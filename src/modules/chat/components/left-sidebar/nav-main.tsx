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
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

        <SidebarMenuItem >
          <SidebarMenuButton
            onClick={addConversation}
            className="font-medium py-0"
            tooltip="New Chat"
          >
            <SquarePen className="size-5" />
            <span>New Schedule Chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

    </SidebarMenu>

  )
}
