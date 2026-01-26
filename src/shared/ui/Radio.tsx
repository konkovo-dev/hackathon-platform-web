import { cn } from '@/shared/lib/cn'
import { type InputHTMLAttributes, forwardRef } from 'react'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          'flex items-center gap-m4 cursor-pointer',
          'typography-caption-sm-regular text-text-primary',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="radio"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-m8 h-m8 rounded-[var(--spacing-m4)] border border-solid', // 8px (круг)
              'border-border-strong peer-checked:border-border-focus',
              'peer-disabled:opacity-50',
              'transition-colors',
              'flex items-center justify-center'
            )}
          >
            <div
              className={cn(
                'w-m5 h-m5 bg-border-focus rounded-[var(--spacing-m4)]',
                'peer-checked:opacity-100 opacity-0',
                'transition-opacity'
              )}
            />
          </div>
        </div>
        {label && <span className="whitespace-nowrap">{label}</span>}
      </label>
    )
  }
)

Radio.displayName = 'Radio'
