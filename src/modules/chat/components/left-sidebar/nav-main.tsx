import { type LucideIcon,  PlusCircle } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel
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
      <br></br><br></br><br></br>

      <SidebarGroupLabel className="px-2 py-1 text-2xl font-bold text-orange-500 tracking-tight">
        Food Tour
      </SidebarGroupLabel>

      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

        <SidebarMenuItem >
          <SidebarMenuButton onClick={addConversation} className="font-medium py-0">
            <PlusCircle className="size-5" />
            <span>New Chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

    </SidebarMenu>

    
  )
}
