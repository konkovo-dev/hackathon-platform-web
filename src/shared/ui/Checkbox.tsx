import { cn } from '@/shared/lib/cn'
import { type InputHTMLAttributes, forwardRef } from 'react'

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
              'peer-checked:bg-border-focus',
              'peer-disabled:opacity-50',
              'transition-colors',
              'flex items-center justify-center'
            )}
          >
            <svg
              className={cn(
                'w-m5 h-m5 text-text-inverse',
                'peer-checked:opacity-100 opacity-0',
                'transition-opacity'
              )}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8L6 11L13 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {label && <span className="whitespace-nowrap">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
