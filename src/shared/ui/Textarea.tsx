import { cn } from '@/shared/lib/cn'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, disabled, placeholder, ...props }, ref) => {
    const processedPlaceholder =
      typeof placeholder === 'string' && placeholder.length > 0 ? `# ${placeholder}` : placeholder

    return (
      <div
        className={cn(
          'flex min-h-[120px] overflow-hidden border border-solid transition-all duration-150',
          'rounded-[var(--spacing-m4)]',
          'px-m4 py-m2',
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
            'w-full bg-transparent border-0 outline-none resize-y',
            'typography-caption-sm-regular',
            'text-text-primary placeholder:text-text-tertiary',
            'placeholder:lowercase',
            'focus:outline-none',
            'disabled:cursor-not-allowed'
          )}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
