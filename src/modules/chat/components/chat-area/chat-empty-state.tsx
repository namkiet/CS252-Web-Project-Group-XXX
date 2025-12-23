import { Bot } from 'lucide-react'
import { useTranslation } from 'react-i18next';

export function ChatEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 p-4 animate-in fade-in duration-500">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center shadow-sm">
        <Bot className="w-6 h-6 md:w-8 md:h-8 text-[var(--color-brand)]" />
      </div>
      <p className="text-base md:text-lg text-center max-w-[80%]">{t('chat.area.empty_state')}</p>
    </div>
  )
}