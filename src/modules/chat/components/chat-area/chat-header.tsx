import { SidebarTrigger } from "@/shared/components/ui/sidebar"

type ChatHeaderProps = {
  title: string;
}

export function ChatHeader({title} :ChatHeaderProps) {
  return (
    <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b px-4 z-10">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <span className="font-semibold text-gray-700">{title}</span>
      </div>
    </header>
  )
}