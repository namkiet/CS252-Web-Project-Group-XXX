import { Send } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  return (
    <div className="p-3 md:p-4 bg-white border-t shrink-0 z-20">
      <div className="mx-auto max-w-3xl relative rounded-2xl border bg-gray-50 focus-within:ring-1 focus-within:ring-[var(--color-brand)] shadow-sm transition-all">
        <Textarea
          placeholder="Type your recommendation (Example: Suggest for me a nice restaurant)..."
          className="min-h-[48px] md:min-h-[55px] w-full border-0 bg-transparent p-3 md:p-4 pr-12 md:pr-14 resize-none focus-visible:ring-0 shadow-none text-base md:text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSubmit()}
        />
        <Button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          size="icon"
          className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 bg-[var(--color-brand)] text-white h-8 w-8 md:h-10 md:w-10 rounded-xl hover:bg-[var(--color-brand)]/90 transition-all"
        >
          <Send size={18} className='md:w-[18px] md:h-[18px]' />
        </Button>
      </div>
    </div>
  )
}