import { cn } from '@/shared/lib/cn'
import { type InputHTMLAttributes, forwardRef } from 'react'
import { Icon } from './Icon'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
            type="checkbox"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-m8 h-m8 rounded-[var(--spacing-m2)] border border-solid', // 4px
              'border-border-strong peer-checked:border-border-focus',
              'peer-disabled:opacity-50',
              'transition-colors',
              'flex items-center justify-center'
            )}
          />
          <Icon
            src="/icons/icon-tick/icon-tick-sm.svg"
            size="sm"
            colorClassName="bg-icon-primary"
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'pointer-events-none',
              'opacity-0 peer-checked:opacity-100 transition-opacity'
            )}
          />
        </div>
        {label && <span className="whitespace-nowrap">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
