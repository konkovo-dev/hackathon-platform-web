import { cn } from '@/shared/lib/cn'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  fillHeight?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, disabled, placeholder, fillHeight = false, ...props }, ref) => {
    const processedPlaceholder =
      typeof placeholder === 'string' && placeholder.length > 0 ? `# ${placeholder}` : placeholder

    return (
      <div
        className={cn(
          'flex overflow-hidden border border-solid transition-all duration-150',
          'rounded-[var(--spacing-m4)]',
          'px-m4 py-m2',
          fillHeight ? 'flex-1 min-h-0' : 'min-h-[120px]',
          error ? 'border-state-error' : 'border-border-strong focus-within:border-border-focus',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <textarea
          ref={ref}
          disabled={disabled}
          placeholder={processedPlaceholder}
          className={cn(
            'w-full bg-transparent border-0 outline-none',
            'typography-caption-sm-regular',
            'text-text-primary placeholder:text-text-tertiary',
            'placeholder:lowercase',
            'focus:outline-none',
            'disabled:cursor-not-allowed',
            fillHeight ? 'flex-1 min-h-0 resize-none' : 'resize-y'
          )}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
