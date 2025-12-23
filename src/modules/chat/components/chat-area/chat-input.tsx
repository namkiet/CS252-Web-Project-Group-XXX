import { useTranslation } from 'react-i18next';
import { Send, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onRemoveDish: (index: number) => void;
  isLoading: boolean;
  suggestedDish?: string[];
}

export function ChatInput({ value, onChange, onSubmit, onRemoveDish, isLoading, suggestedDish = [] }: ChatInputProps) {
  const { t } = useTranslation();

  const hasSuggestions = suggestedDish.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (value.trim() || suggestedDish.length > 0) {
        e.preventDefault();
        onSubmit();
      }
    }
  };

  return (
    <div className="p-3 md:p-4 bg-white border-t shrink-0 z-20">
      {hasSuggestions && (
        <div className="mx-auto max-w-3xl mb-3">
          <div className="flex items-start gap-2 rounded-2xl border bg-white shadow-sm px-3 py-2.5">
            <span className="text-xs font-semibold text-gray-700 mt-0.5">{t('chat.area.input.suggested')}</span>
            <div className="flex flex-wrap gap-2">
              {suggestedDish.map((dish, idx) => (
                <div
                  key={`${dish}-${idx}`}
                  className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 border border-orange-100 rounded-full pl-3 pr-1.5 py-1"
                >
                  <span>{dish}</span>
                  <button
                    onClick={() => onRemoveDish(idx)}
                    className="p-0.5 hover:bg-orange-200/50 rounded-full transition-colors"
                    title={t('chat.area.input.remove_suggest')}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl relative rounded-2xl border bg-gray-50 focus-within:ring-1 focus-within:ring-[var(--color-brand)] shadow-sm transition-all">
        <Textarea
          placeholder={t('chat.area.input.placeholder')}
          className="min-h-[48px] md:min-h-[55px] w-full border-0 bg-transparent p-3 md:p-4 pr-12 md:pr-14 resize-none focus-visible:ring-0 shadow-none text-base md:text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={onSubmit}
          disabled={(!value.trim() && suggestedDish.length === 0) || isLoading}
          size="icon"
          className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 bg-[var(--color-brand)] text-white h-8 w-8 md:h-10 md:w-10 rounded-xl hover:bg-[var(--color-brand)]/90 transition-all"
        >
          <Send size={18} className='md:w-[18px] md:h-[18px]' />
        </Button>
      </div>
    </div>
  )
}